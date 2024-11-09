// e-mail用に使うResend用のテンプレート
// https://resend.com/docs/send-with-nextjs

interface EmailTemplateProps {
  username: string;
  email: string;
  content: string;
}

// 受け取るメールのテンプレート
export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  // 相手側(送信者)ユーザー名
  username,
  // 相手側(送信者)ユーザーのメールアドレス
  email,
  // メールの内容
  content,
}) => (
  <div>
    <h1>こんにちは, {username}です。</h1>
    <p>{email}から届きました。</p>
    <p>{content}</p>
  </div>
);
