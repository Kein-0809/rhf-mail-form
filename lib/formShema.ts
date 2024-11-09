// Zodを使ってフォームのスキーマを定義

import * as z from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_MB = 5;
const MAX_FILE_SIZE = MAX_MB * 1024 * 1024;

export const formSchema = z.object({
  // usernameはstring型で、2文字以上であることを検証
  username: z.string().min(2, {
    message: "ユーザー名は2文字以上で入力してください。",
  }),
  // subjectはstring型で、2文字以上であることを検証
  subject: z.string().min(2, {
    message: "主題は2文字以上で入力してください。",
  }),
  // emailはstring型で、適切なメールアドレスであることを検証
  email: z
    .string()
    .email({ message: "適切なメールアドレスを入力してください。" }),
  // contentはstring型で、10文字以上で160文字以内であることを検証
  content: z
    .string()
    .min(10, {
      message: "本文は10文字以上で入力してください。",
    })
    .max(160, {
      message: "本文は160文字以内で入力してください。",
    }),
  // fileはany型で、1つのファイルが必要であることを検証
  file: z
    .any()
    // ファイルが1つであることを検証
    .refine((files) => files?.length == 1, "ファイル画像が必要です。")
    // ファイルサイズが5MB以下であることを検証
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `画像サイズは5MBまでです。`
    )
    // ファイルの拡張子が.jpg, .jpeg, .png, .webpであることを検証
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webpファイルのみ利用できます。"
    ),
});
  