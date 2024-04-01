import * as PostsTransformModule from "./posts-transform";
import * as CommentTransformModule from "./comment-transofm";
import * as DatumTransformModule from "./datum-transform";

export namespace Transform {
  export const Posts: typeof PostsTransformModule = PostsTransformModule;
  export const Comment: typeof CommentTransformModule = CommentTransformModule;
  export const Datum: typeof DatumTransformModule = DatumTransformModule;

  export function toDOM(dom: string) {
    return new DOMParser().parseFromString(dom, "text/html");
  }
}
