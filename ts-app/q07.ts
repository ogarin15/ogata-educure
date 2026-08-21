// ① formatComment()

function formatComment(
  value: string | number | boolean
): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return value ? "はい" : "いいえ";
}

// ② logCommentError()

function logCommentError(
  err: Error | string
): string {
  if (err instanceof Error) {
    return `[${err.name}] ${err.message}`;
  }

  return err;
}

// ③ describeReaction()

type LikeReaction = {
  likeCount: number;
};

type CommentReaction = {
  commentText: string;
};

type Reaction = LikeReaction | CommentReaction;

function describeReaction(
  reaction: Reaction
): string {
  if ("likeCount" in reaction) {
    return `${reaction.likeCount}いいね!`;
  }

  return `コメント:${reaction.commentText}`;
}

// 動作確認

console.log(formatComment("hello"));
console.log(formatComment(3.14159));
console.log(formatComment(42));
console.log(formatComment(true));
console.log(formatComment(false));

console.log(
  logCommentError(new Error("DB failed"))
);

console.log(
  logCommentError(
    new TypeError("type mismatch")
  )
);

console.log(
  logCommentError("ただの文字列エラー")
);

console.log(
  describeReaction({
    likeCount: 5,
  })
);

console.log(
  describeReaction({
    commentText: "素晴らしい!",
  })
);
