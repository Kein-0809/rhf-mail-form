//https://github.com/itkr/my-file-input-example/blob/main/src/hooks/useFileInput.tsx
//https://reffect.co.jp/react/shadcn-react
"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import useMailForm from "@/app/hooks/useMailForm";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/lib/formShema";
import { useForm } from "react-hook-form";

const MailForm = () => {
  // const form = useForm({
  //   // zodResolverを使ってformSchemaをフォームのresolverとして設定
  //   resolver: zodResolver(formSchema),
  //   // フォームの初期値を設定
  //   defaultValues: {
  //     username: "",
  //     email: "",
  //     content: "",
  //     file: null,
  //   },
  // });
  // // フォームの送信関数
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  // }

  // "useMailForm.ts"で定義したuseMailFormという名前のフック (自作のカスタムフック)の
  // 返し値である"form"(フォームの状態を表す値)と"onSubmit"(フォームが送信された時に実行される関数)を
  // それぞれ"form"と"onSubmit"という名前で受け取る
  const { form, onSubmit } = useMailForm();

  // 送信成功時にトーストを表示
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      toast.success("メール送信に成功しました！");
    }
  }, [form.formState.isSubmitSuccessful]);

  {/* <Form {...form}/>の "...form"の意味について
      {...form} は、React Hook Form から提供される form オブジェクトのすべてのプロパティを
      Form コンポーネントに展開（スプレッド）します。
      
      これには以下のような重要な機能が含まれます：
      - form.register: 入力フィールドの登録
      - form.handleSubmit: フォーム送信のハンドリング 
      - form.formState: バリデーション状態の管理
      - form.control: フォームコントロールの管理
      
      このスプレッド構文を使用することで、Form コンポーネントが
      React Hook Form の機能をシームレスに利用できるようになります。
    */}

  return (
    // Formコンポーネントを使ってフォームを作成
    <Form {...form}>
      {/* トーストコンテナ */}
      <ToastContainer />
      {/* フォーム */}
      {/* onSubmit={form.handleSubmit(onSubmit)}でフォームに入力された値をonSubmit関数に"values"として渡される */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 container"
      >
        {/* お名前のフォームフィールド */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>お名前</FormLabel>
              <FormControl>
                <Input {...field} placeholder="お名前" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* メールアドレスのフォームフィールド */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input {...field} placeholder="メールアドレス" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 主題のフォームフィールド */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主題</FormLabel>
              <FormControl>
                <Input {...field} placeholder="主題" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 本文のフォームフィールド */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>本文</FormLabel>
              <FormControl>
                {/* Inputコンポーネントの代わりにTextareaコンポーネントを使用して長文入力を可能にする */}
                <Textarea
                  placeholder="本文"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ファイルのフォームフィールド */}
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (  
            // field プロパティを分割代入で取得
            // - value: フィールドの現在の値
            // - onChange: 値を更新するための関数
            // - ...fieldProps: その他のフィールドプロパティ（name, ref など）をスプレッド構文で取得
            <FormItem>
              <FormControl>
                <Input
                  type="file"
                  {...fieldProps}  // その他のフィールドプロパティを Input コンポーネントに展開
                  accept="image/*"
                  onChange={(event) => {
                    // ファイル選択時のイベントハンドラ
                    // event.target.files からファイルリストを取得し、
                    // React Hook Form の onChange 関数に渡してフォームの状態を更新
                    onChange(event.target.files && event.target.files);
                    // これは短絡評価（ショートサーキット）の利用で以下のような意味になります：
                    // 1. 左側のevent.target.files が null または undefined でない場合、event.target.files を返す
                    // 2. 左側のevent.target.files が null または undefined の場合、false を返す
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 送信ボタン */}
        <Button
          type="submit"
          className="mt-3"
          style={{ width: "100%" }}
          // 送信中の場合はボタンを無効化
          disabled={form.formState.isSubmitting}
        >
          {/* 送信中の場合はClipLoaderを表示し、送信完了の場合は"送信"と表示 */}
          {/* これはReact Hook Formの機能であるform.formState.isSubmittingを使っている */}
          {form.formState.isSubmitting ? <ClipLoader /> : "送信"}
        </Button>
      </form>
    </Form>
  );
};

export default MailForm;
