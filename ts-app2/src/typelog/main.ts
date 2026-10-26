import { parseMarkdown } from "@/simple-markdown.js";
import { submitPost } from "@/typelog/api";
import { PostCreateSchema, type PostCreateErrors } from "@/typelog/schemas/post";

const form = document.getElementById("post-form") as HTMLFormElement;
const titleInput = document.getElementById("title") as HTMLInputElement;
const bodyInput = document.getElementById("body") as HTMLTextAreaElement;
const categoryInput = document.getElementById("category") as HTMLSelectElement;
const preview = document.getElementById("preview") as HTMLDivElement;
const result = document.getElementById("result") as HTMLDivElement;
const errTitle = document.getElementById("err-title") as HTMLParagraphElement;
const errBody = document.getElementById("err-body") as HTMLParagraphElement;
const postedView = document.getElementById("posted-view") as HTMLElement;
const postedId = document.getElementById("posted-id") as HTMLSpanElement;
const postedCategory = document.getElementById("posted-category") as HTMLSpanElement;
const postedTitle = document.getElementById("posted-title") as HTMLSpanElement;
const postedBody = document.getElementById("posted-body") as HTMLDivElement;
const newPostButton = document.getElementById("new-post-btn") as HTMLButtonElement;
const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

function showResult(message: string, type: "loading" | "success" | "error"): void {
  result.textContent = message;
  result.className = `result ${type}`;
  result.classList.remove("hidden");
}

function clearErrors(): void {
  errTitle.textContent = "";
  errBody.textContent = "";
}

function showValidationErrors(errors: PostCreateErrors): void {
  errTitle.textContent = errors.title ?? "";
  errBody.textContent = errors.body ?? "";
}

function renderPreview(): void {
  // This small Markdown renderer returns HTML; escape raw user text before inserting.
  preview.innerHTML = parseMarkdown(bodyInput.value);
}

bodyInput.addEventListener("input", renderPreview);

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  if (submitButton.disabled) return;

  const draft = {
    title: titleInput.value,
    body: bodyInput.value,
    category: categoryInput.value,
  };
  console.log("Draft 取得:", draft);

  const parsed = PostCreateSchema.safeParse(draft);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const errors: PostCreateErrors = {
      title: fieldErrors.title?.[0],
      body: fieldErrors.body?.[0],
      category: fieldErrors.category?.[0],
    };
    clearErrors();
    showValidationErrors(errors);
    showResult("✕ 検証エラー", "error");
    console.log("✕ 検証失敗:", errors);
    return;
  }

  clearErrors();
  console.log("検証成功:", parsed.data);
  showResult("送信中...", "loading");
  submitButton.disabled = true;
  console.log("API送信中...");

  try {
    const apiResult = await submitPost(parsed.data);
    if (!apiResult.ok) {
      showResult(`✕ 投稿失敗: ${apiResult.error.code} - ${apiResult.error.message}`, "error");
      console.log("✕ 投稿失敗:", apiResult.error);
      return;
    }

    showResult(`✓ 投稿成功: ID=${apiResult.data.id}`, "success");
    console.log("投稿成功:", apiResult.data);

    postedId.textContent = String(apiResult.data.id);
    postedCategory.textContent = parsed.data.category;
    postedTitle.textContent = parsed.data.title;
    postedBody.innerHTML = parseMarkdown(parsed.data.body);
    postedView.classList.remove("hidden");
    postedView.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error: unknown) {
    // submitPost is designed to return ApiResult, but keep the UI resilient to unexpected errors.
    const message = error instanceof Error ? error.message : "予期しないエラーが発生しました";
    showResult(`✕ 投稿失敗: UNEXPECTED_ERROR - ${message}`, "error");
    console.error("予期しないエラー:", error);
  } finally {
    submitButton.disabled = false;
  }
});

newPostButton.addEventListener("click", () => {
  form.reset();
  preview.innerHTML = "";
  result.textContent = "";
  result.className = "result hidden";
  clearErrors();
  postedView.classList.add("hidden");
  titleInput.focus();
});
