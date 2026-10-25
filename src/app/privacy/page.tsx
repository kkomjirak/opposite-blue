import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '개인정보 처리 안내 — Opposite Blue' };

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-20 text-neutral-800">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">개인정보 처리 안내</h1>
      <p className="mt-5 text-base leading-relaxed text-neutral-600">견적 문의를 보낼 때 어떤 정보가 어디로 전달되는지 안내합니다. 이 안내는 이 웹사이트의 문의 양식을 기준으로 합니다.</p>
      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <section className="space-y-3"><h2 className="text-xl font-semibold">문의에 사용하는 정보</h2>
          <p>담당자명, 이메일 주소, 프로젝트 내용은 문의 확인과 답변에 사용합니다. 회사·브랜드명, 연락처, 요청 서비스, 예산, 일정은 상담 범위를 파악하기 위한 정보입니다. 선택 항목을 입력하지 않아도 문의할 수 있습니다.</p>
          <p>주민등록번호, 계정 비밀번호, 결제정보, 고객 명단 등 상담에 불필요한 개인정보나 기밀자료는 보내지 마세요.</p>
        </section>
        <section className="space-y-3"><h2 className="text-xl font-semibold">전송 경로와 외부 서비스</h2>
          <p>문의 양식은 외부 전송 서비스 FormSubmit을 통해 <a className="text-brand-blue underline underline-offset-4" href="mailto:contact@oppositeblue.co.kr">contact@oppositeblue.co.kr</a>로 전달됩니다. 전송 시 입력한 내용이 FormSubmit 서버에서 처리되며, 제공자의 네트워크·보안 처리에 관한 정책도 적용됩니다.</p>
          <p>자세한 내용은 <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline underline-offset-4">FormSubmit 개인정보 안내 (PDF, 새 창)</a>를 확인하세요. 외부 서비스를 통한 전송을 원하지 않으면 직접 이메일로 문의할 수 있습니다.</p>
          <p>양식은 작성 내용을 이 브라우저의 로컬 저장소에 자동 보관하지 않습니다. 전송에 실패하면 현재 화면의 입력 내용은 유지되지만, 새로고침하거나 페이지를 떠나면 사라질 수 있습니다.</p>
        </section>
        <section className="space-y-3"><h2 className="text-xl font-semibold">보관과 삭제 문의</h2>
          <p>접수된 내용은 수신 이메일함과 전송 서비스의 처리 범위에 따라 보관될 수 있습니다. 보관 여부 확인, 내용 정정, 삭제 또는 상담 철회는 아래 이메일로 요청해 주세요. 외부 서비스에 남는 정보는 해당 서비스의 정책에 따릅니다.</p>
          <a href="mailto:contact@oppositeblue.co.kr?subject=개인정보%20관련%20문의" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">contact@oppositeblue.co.kr</a>
        </section>
        <section className="space-y-3"><h2 className="text-xl font-semibold">동의와 대안</h2>
          <p>양식 제출 전 필수 정보의 문의 처리와 FormSubmit을 통한 전송에 동의해야 합니다. 동의하지 않으면 양식 전송은 이용할 수 없으며, 직접 이메일 문의를 선택할 수 있습니다. 웹사이트 열람과 작업물 확인에는 양식 제출이나 동의가 필요하지 않습니다.</p>
        </section>
      </div>
      <Link href="/contact" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-neutral-900 text-white px-6 text-sm font-medium">견적 문의로 돌아가기</Link>
    </article>
  );
}
