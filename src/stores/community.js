import { defineStore } from "pinia";
import {
  communityCall,
  requestId,
  readPhoto,
  resolveImage,
  communityMode,
  localCommunityLogin,
} from "@/services/community-api";
import { getStorage, setStorage } from "@/services/storage";
export const useCommunityStore = defineStore("community", {
  state: () => ({
    member: null,
    journals: [],
    journalCursor: null,
    posts: [],
    postCursor: null,
    images: {},
    error: "",
    mode: communityMode,
  }),
  actions: {
    async loginLocal(username, password) {
      await localCommunityLogin(username, password);
      this.$reset();
      const { useUserStore } = await import("./user");
      const { useAssessmentStore } = await import("./assessment");
      const { useExperienceStore } = await import("./experience");
      useUserStore().$reset();
      useAssessmentStore().$reset();
      useExperienceStore().$reset();
      return this.ensure();
    },
    async ensure() {
      const m = await communityCall("identity.ensure", {
        requestId: requestId(),
      });
      if (this.member && this.member.id !== m.id) {
        this.journals = [];
        this.posts = [];
        this.images = {};
      }
      this.member = m;
      return m;
    },
    async loadJournals(more = false) {
      await this.ensure();
      const r = await communityCall("journals.list", {
        cursor: more ? this.journalCursor : null,
      });
      this.journals = more
        ? [
            ...this.journals,
            ...r.items.filter((x) => !this.journals.some((y) => y.id === x.id)),
          ]
        : r.items;
      this.journalCursor = r.nextCursor;
      await this.loadImages(r.items);
      return r;
    },
    async loadPosts(more = false) {
      await this.ensure();
      const r = await communityCall("posts.list", {
        cursor: more ? this.postCursor : null,
      });
      this.posts = more
        ? [
            ...this.posts,
            ...r.items.filter((x) => !this.posts.some((y) => y.id === x.id)),
          ]
        : r.items;
      this.postCursor = r.nextCursor;
      this.images = {};
      await this.loadImages(this.posts);
      return r;
    },
    async loadImages(items) {
      await Promise.all(
        items
          .flatMap((x) => x.assetIds || [])
          .map(async (id) => {
            try {
              this.images[id] = await resolveImage(id);
            } catch {
              delete this.images[id];
            }
          }),
      );
    },
    async getJournal(journalId) {
      await this.ensure();
      const j = await communityCall("journals.get", { journalId });
      await this.loadImages([j]);
      return j;
    },
    async getPost(postId) {
      await this.ensure();
      const p = await communityCall("posts.get", { postId });
      await this.loadImages([p]);
      return p;
    },
    async upload(path, id = requestId()) {
      await this.ensure();
      const base64 = await readPhoto(path);
      return communityCall("media.upload", { base64, requestId: id });
    },
    async saveJournal(payload) {
      return communityCall("journals.save", payload);
    },
    async deleteJournal(j) {
      return communityCall("journals.delete", {
        journalId: j.id,
        expectedRevision: j.revision,
        requestId: requestId(),
      });
    },
    async publication(type, source, post, desiredPublished, id = requestId()) {
      return communityCall("posts.publication", {
        sourceType: type,
        sourceId: source.id,
        sourceRevision: source.revision,
        expectedPostRevision: post?.revision ?? null,
        desiredPublished,
        requestId: id,
      });
    },
    async shareExperience(record, desiredPublished) {
      await this.ensure();
      const key = `horticulture:share-map:${this.member.id}:${record.id}`;
      let localSourceKey = getStorage(key, null);
      if (!localSourceKey) {
        localSourceKey = requestId();
        setStorage(key, localSourceKey);
      }
      let source = await communityCall("shares.find", { localSourceKey });
      if (!source && !desiredPublished) return { status: "unpublished" };
      if (!source)
        source = await communityCall("shares.save", {
          localSourceKey,
          courseTitle: record.courseTitle,
          mood: record.mood,
          feeling: record.feeling,
          assetIds: [],
          requestId: `source-${localSourceKey}`,
        });
      const post = await communityCall("posts.forSource", {
        sourceType: "experience",
        sourceId: source.id,
      });
      return this.publication("experience", source, post, desiredPublished);
    },
    async like(post) {
      return communityCall("posts.like", {
        postId: post.id,
        liked: !post.liked,
        requestId: requestId(),
      });
    },
    async comments(postId, cursor = null) {
      return communityCall("comments.list", { postId, cursor });
    },
    async comment(postId, body, id) {
      return communityCall("comments.create", { postId, body, requestId: id });
    },
    async removeComment(commentId) {
      return communityCall("comments.delete", {
        commentId,
        requestId: requestId(),
      });
    },
  },
});
