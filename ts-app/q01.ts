type Author = {
  id: number;
  username: string;
  joinedAt: Date;

  // フィールド自体を省略可能
  nickname?: string;

  // キー必須、値は null を許可
  bio: string | null;

  // キー必須、値は undefined を許可
  avatarUrl: string | undefined;
};

// 表示名を返す
function displayName(author: Author): string {
  if (author.nickname !== undefined) {
    return "@" + author.nickname;
  }

  return author.username;
}

// 自己紹介を返す
function bioText(author: Author): string {
  if (author.bio === null) {
    return "";
  }

  return author.bio;
}

// アバターURLを返す
function avatar(author: Author): string {
  if (author.avatarUrl === undefined) {
    return "/default-avatar.png";
  }

  return author.avatarUrl;
}

// サンプルデータ

const alice: Author = {
  id: 1,
  username: "alice",
  joinedAt: new Date(),
  bio: null,
  avatarUrl: undefined,
};

const bob: Author = {
  id: 2,
  username: "bob",
  joinedAt: new Date(),
  nickname: "Bobby",
  bio: null,
  avatarUrl: undefined,
};

const carol: Author = {
  id: 3,
  username: "carol",
  joinedAt: new Date(),
  bio: "こんにちは！",
  avatarUrl: "/carol.png",
};

const dave: Author = {
  id: 4,
  username: "dave",
  joinedAt: new Date(),
  nickname: "デイブ",
  bio: null,
  avatarUrl: "/dave.png",
};

// 実行

console.log(
  displayName(alice),
  "|",
  bioText(alice),
  "|",
  avatar(alice)
);

console.log(
  displayName(bob),
  "|",
  bioText(bob),
  "|",
  avatar(bob)
);

console.log(
  displayName(carol),
  "|",
  bioText(carol),
  "|",
  avatar(carol)
);

console.log(
  displayName(dave),
  "|",
  bioText(dave),
  "|",
  avatar(dave)
);
