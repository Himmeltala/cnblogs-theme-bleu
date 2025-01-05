import * as DatumHttp from "./datum-api";
import * as CommentHttp from "./comment-api";
import * as PostsHttp from "./posts-api";

export namespace Requests {
  export const Datum: typeof DatumHttp = DatumHttp;
  export const Comment: typeof CommentHttp = CommentHttp;
  export const Posts: typeof PostsHttp = PostsHttp;
}
