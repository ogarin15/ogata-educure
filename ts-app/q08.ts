// PostState

type DraftPost = {
  status: "draft";
  title: string;
  lastEditedAt: Date;
};

type PublishedPost = {
  status: "published";
  title: string;
  publishedAt: Date;
  viewCount: number;
};

type ArchivedPost = {
  status: "archived";
  title: string;
  archivedAt: Date;
  reason: string;
};

type PostState =
  | DraftPost
  | PublishedPost
  | ArchivedPost;

// describeState

function describeState(state: PostState): string {
  switch (state.status) {
    case "draft":
      return `下書き:${state.title}(最終編集 ${state.lastEditedAt
        .toISOString()
        .slice(0, 10)})`;

    case "published":
      return `公開済み:${state.title}(${state.viewCount}回閲覧)`;

    case "archived":
      return `アーカイブ:${state.title}(理由:${state.reason})`;

    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}

// TransitionResult

type SuccessResult = {
  ok: true;
  newState: PublishedPost;
};

type FailureResult = {
  ok: false;
  reason: string;
};

type TransitionResult = SuccessResult | FailureResult;

// publish

function publish(
  state: PostState,
  publishedAt: Date
): TransitionResult {
  switch (state.status) {
    case "draft":
      return {
        ok: true,
        newState: {
          status: "published",
          title: state.title,
          publishedAt: publishedAt,
          viewCount: 0,
        },
      };

    case "published":
      return {
        ok: false,
        reason: "既に公開済みの記事は再公開できません",
      };

    case "archived":
      return {
        ok: false,
        reason: "アーカイブ済みの記事は公開できません",
      };

    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}

// サンプルデータ

const draft: DraftPost = {
  status: "draft",
  title: "執筆中の記事",
  lastEditedAt: new Date("2024-01-10"),
};

const published: PublishedPost = {
  status: "published",
  title: "公開済み記事",
  publishedAt: new Date("2024-02-01"),
  viewCount: 1234,
};

const archived: ArchivedPost = {
  status: "archived",
  title: "アーカイブ済み",
  archivedAt: new Date("2024-03-01"),
  reason: "古い情報のため",
};

// 動作確認

console.log(describeState(draft));

console.log(describeState(published));

console.log(describeState(archived));

const success = publish(
  draft,
  new Date("2024-04-01")
);

if (success.ok) {
  console.log("公開成功:", success.newState);
}

const failure = publish(
  published,
  new Date("2024-04-01")
);

if (!failure.ok) {
  console.log("公開失敗:", failure.reason);
}
