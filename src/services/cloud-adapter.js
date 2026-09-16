import { communityCall, requestId, resolveImage } from "./community-api";
import { getStorage, setStorage } from "./storage";
const clone = (v) => JSON.parse(JSON.stringify(v));
export function createCloudAdapter(local) {
  let identity = null,
    identityPromise = null;
  const completions = new Map();
  async function ensure() {
    if (!identityPromise)
      identityPromise = communityCall("identity.ensure", {
        requestId: requestId(),
      })
        .then((x) => {
          identity = x;
          return x;
        })
        .finally(() => {
          identityPromise = null;
        });
    return identityPromise;
  }
  const key = (name) => {
    if (!identity) throw new Error("请先连接用户身份");
    return `horticulture:member:${identity.id}:${name}`;
  };
  const read = (name, fallback) => getStorage(key(name), fallback),
    write = (name, value) => setStorage(key(name), value);
  async function courseImages(c) {
    const result = clone(c);
    result.sourceSnapshot = clone(c);
    if (result.cover && !result.cover.startsWith("/static/"))
      result.cover = await resolveImage(result.cover);
    for (const step of result.steps || [])
      if (step.image && !step.image.startsWith("/static/"))
        step.image = await resolveImage(step.image);
    return result;
  }
  const adapter = {
    async getCurrentUser() {
      await ensure();
      return {
        ...read("user", {
          profileCompleted: false,
          ageRange: "",
          gardenExperience: "",
          goals: [],
        }),
        id: identity.id,
        nickname: identity.nickname,
        membershipStatus: identity.membershipStatus,
      };
    },
    async mockLogin() {
      return this.getCurrentUser();
    },
    async saveUserProfile(profile) {
      const current = await this.getCurrentUser();
      if (profile.nickname !== current.nickname)
        identity = await communityCall("identity.nickname", {
          nickname: profile.nickname,
          expectedRevision: identity.revision,
          requestId: requestId(),
        });
      const value = {
        ...current,
        ...profile,
        id: identity.id,
        profileCompleted: !!profile.profileCompleted,
      };
      write("user", value);
      return value;
    },
    getAssessmentQuestions: () => local.getAssessmentQuestions(),
    async getLatestAssessment() {
      await ensure();
      return read("latest-assessment", null);
    },
    async saveAssessmentSubmission(payload) {
      await ensure();
      write("latest-assessment", clone(payload));
      return payload;
    },
    async getCourses() {
      const r = await communityCall("courses.list");
      return Promise.all(r.items.map(courseImages));
    },
    async getCourseById(courseId) {
      return courseImages(await communityCall("courses.get", { courseId }));
    },
    async resolveSessionCourse(snapshot) {
      return courseImages(snapshot);
    },
    async startExperienceSession(courseId) {
      await ensure();
      const current = read("active-session", null);
      if (current?.courseId === courseId && current.status === "active")
        return current;
      const course = await this.getCourseById(courseId);
      if (!course.steps?.length)
        throw new Error("课程正在准备中，请选择多肉种植体验");
      const session = {
        id: `session-${requestId()}`,
        courseId,
        courseVersionId: course.courseVersionId,
        courseSnapshot: course.sourceSnapshot,
        status: "active",
        currentStep: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        recordId: null,
      };
      write("active-session", session);
      return session;
    },
    async getExperienceSession(id) {
      await ensure();
      const s = read("active-session", null);
      return s?.id === id ? s : null;
    },
    async updateExperienceSession(id, updates) {
      const s = await this.getExperienceSession(id);
      if (!s) throw new Error("体验已失效");
      if (s.status === "completed") return s;
      const n = updates.currentStep;
      if (!Number.isInteger(n) || n < 0 || n > s.courseSnapshot.steps.length)
        throw new Error("步骤无效");
      s.currentStep = n;
      write("active-session", s);
      return s;
    },
    async completeExperienceSession(id, payload) {
      if (completions.has(id)) return completions.get(id);
      const operation = (async () => {
        const s = await this.getExperienceSession(id);
        if (!s) throw new Error("体验已失效");
        const records = read("records", []),
          old = records.find((r) => r.sessionId === id);
        if (old) {
          if (s.status !== "completed" || s.recordId !== old.id)
            write("active-session", {
              ...s,
              status: "completed",
              recordId: old.id,
              completedAt: old.completedAt,
              currentStep: s.courseSnapshot.steps.length,
            });
          return old;
        }
        if (s.status === "completed")
          throw new Error("已完成体验的记录无法恢复，请联系项目组");
        const c = s.courseSnapshot;
        const r = {
          id: `record-${requestId()}`,
          sessionId: id,
          userId: identity.id,
          courseId: c.id,
          courseTitle: c.title,
          sense: c.sense,
          mood: payload.mood,
          feeling: payload.feeling || "",
          imageUrl: payload.imageUrl || "",
          duration: c.duration,
          growthIdentity: "自然体验者",
          completedAt: new Date().toISOString(),
        };
        write("records", [r, ...records]);
        write("active-session", {
          ...s,
          status: "completed",
          recordId: r.id,
          completedAt: r.completedAt,
          currentStep: c.steps.length,
        });
        return r;
      })();
      completions.set(id, operation);
      try {
        return await operation;
      } finally {
        completions.delete(id);
      }
    },
    async getRecords() {
      await ensure();
      return read("records", []);
    },
    async getRecordById(id) {
      return (await this.getRecords()).find((r) => r.id === id) || null;
    },
  };
  return adapter;
}
