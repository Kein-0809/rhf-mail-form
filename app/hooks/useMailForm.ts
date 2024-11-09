// カスタムフック
// フロントエンドからメール送信APIを叩いてPOSTリクエストを送信する

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/formShema";
import * as z from "zod";
import { useCallback } from "react";

const useMailForm = () => {
  // フォームの状態と送信関数を管理
  const form = useForm({
    // zodResolverを使ってformSchemaをフォームのresolverとして設定
    // formSchemaを使ってzodでバリデーションをする
    resolver: zodResolver(formSchema),
    // フォームの初期値を設定
    defaultValues: {
      username: "",
      subject: "",
      email: "",
      content: "",
      file: undefined,
    },
  });

  // フォームの送信関数
  // useCallbackを使ってonSubmit関数をメモ化する (関数の再生成を防ぐ)
  // valuesはフォームから送信されたデータで、React Hook FormのhandleSubmit関数によって
  // フォームの入力値がバリデーションされた後に渡されます。
  // z.infer<typeof formSchema>は、formSchemaで定義された型を推論した型になります。
  // つまり、usernameやemail、content、subject、fileなどのフォームフィールドの値が
  // オブジェクトとして渡されます。
  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    // フォームから受け取ったvaluesの値から、username, email, content, subject, fileをそれぞれの変数に格納
    const { username, email, content, subject, file } = values;

    // ファイルデータを使用するために
    // JSで標準で用意されているFormDataオブジェクトを使用して、フォームデータを格納
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("content", content);
    formData.append("subject", subject);

    if (file) {
      // ファイルはバイナリデータなので、ファイルのバイナリデータをFormDataオブジェクトに追加
      formData.append("file", file[0]); // file は FileList または undefined
    }

    try {
      // バックエンド用APIを叩いてPOSTリクエストを送信する
      // "api/send/route.ts"で定義したPOST Methodでメール送信APIを叩いてメール送信を行う
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send`, {
        method: "POST",
        // フォームから受け取ってFormDataオブジェクトに格納したデータをリクエストのbodyとして送信
        body: formData,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // このファイル内で定義している"form"というデータで表されるフォームの状態と
  // フォームが送信された時に実行される送信関数を返す
  return { form, onSubmit };
};

export default useMailForm;
