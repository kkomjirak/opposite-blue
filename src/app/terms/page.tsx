import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '사이트 이용 안내 — Opposite Blue' };

export default function TermsPage() {
  return (
    <article className="max-w-3xl mx-auto px-6 md:px-12 py-10 md:py-20 text-neutral-800">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">사이트 이용 안내</h1>
      <p className="mt-5 text-neutral-600 leading-relaxed">Opposite Blue의 작업물과 서비스를 살펴보고 프로젝트를 문의할 때 참고해 주세요.</p>
      <div className="mt-10 space-y-8 text-base leading-relaxed">
        <section className="space-y-3"><h2 className="text-xl font-semibold">견적 문의와 계약</h2><p>양식을 통한 문의는 상담 요청입니다. 제출만으로 계약이나 일정 예약이 확정되지 않습니다. 제작 범위, 비용, 일정, 수정 횟수, 산출물과 유지보수 조건은 별도 협의·계약 내용에 따릅니다.</p></section>
        <section className="space-y-3"><h2 className="text-xl font-semibold">작업물과 외부 링크</h2><p>포트폴리오는 작업 사례를 소개하기 위한 자료입니다. 브랜드·상표·이미지 등 각 자료의 권리는 해당 권리자에게 있으며, 열람이 재사용 허락을 의미하지 않습니다. 외부 사이트는 작업 당시와 달라지거나 운영이 중단될 수 있습니다.</p></section>
        <section className="space-y-3"><h2 className="text-xl font-semibold">문의 전송이 되지 않을 때</h2><p>문의 전송은 외부 서비스와 네트워크 상태의 영향을 받습니다. 성공 메시지는 전송 서비스의 접수 응답을 뜻하며, 담당자의 메일 확인이나 답변 완료를 뜻하지 않습니다. 오류가 발생하면 작성 내용을 복사해 직접 이메일로 보내 주세요.</p><a href="mailto:contact@oppositeblue.co.kr" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">contact@oppositeblue.co.kr</a></section>
        <section className="space-y-3"><h2 className="text-xl font-semibold">개인정보와 자료 제공</h2><p>문의에는 답변에 필요한 정보만 입력해 주세요. 제공하는 자료의 공유 권한을 확인하고, 민감한 자료의 전달 방식은 먼저 상담해 주세요.</p><Link href="/privacy" className="inline-flex min-h-11 items-center text-brand-blue underline underline-offset-4">개인정보 처리 안내 보기</Link></section>
      </div>
      <Link href="/contact" className="mt-10 inline-flex min-h-12 items-center rounded-full bg-neutral-900 text-white px-6 text-sm font-medium">프로젝트 문의하기</Link>
    </article>
  );
}
