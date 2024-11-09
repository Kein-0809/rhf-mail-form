// https://resend.com/docs/send-with-nextjs
// メール送信API
// バックエンド用API
// フロントエンドからメール送信APIを叩いてPOSTリクエストを送信する

import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as React from "react";
import { EmailTemplate } from "@/components/email-template";
import { array } from "zod";

// ResendのAPIキーを取得
const resend = new Resend(process.env.RESEND_API_KEY);

// POST Methodでメール送信APIを叩いてメール送信を行う
// Requestオブジェクトを受け取り、メール送信を行う
export async function POST(request: Request) {
  // "useMailForm.ts"からFormDataオブジェクトとして送信された
  // リクエストのbodyをFormDataオブジェクトとして取得
  const formData = await request.formData();

  // FormDataオブジェクトから各フィールドの値を取得
  const username = formData.get("username");
  const email = formData.get("email");
  const content = formData.get("content");
  const subject = formData.get("subject");
  // FormDataオブジェクトからファイルデータを取得
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  // ファイルのバイナリデータを取得
  const buffer = Buffer.from(await file.arrayBuffer());
  console.log(file.name);
  console.log(buffer);

  // 値が string であることを確認する
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof content !== "string" ||
    typeof subject !== "string"
  ) {
    throw new Error("Invalid form data");
  }

  try {
    const { data, error } = await resend.emails.send({
      // Resendのメール送信APIを使用してメールを送信
      // from: 送信元メールアドレス
      from: "onboarding@resend.dev",
      
      // to: 送信先メールアドレス（環境変数から取得）
      to: [process.env.MY_EMAIL as string],
      
      // subject: メールの件名
      subject: subject,
      
      // attachments: 添付ファイルの設定
      attachments: [
        { 
          filename: file.name,  // アップロードされたファイルの名前
          content: buffer       // ファイルのバイナリデータ
        }
      ],
      
      // react: メールのテンプレートコンポーネント
      react: EmailTemplate({
        username,  // ユーザー名
        email,     // メールアドレス
        content    // メール本文
      }) as React.ReactElement,  // ReactElementとして型アサーション
    });

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
