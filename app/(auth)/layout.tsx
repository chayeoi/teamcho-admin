export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#F4F4F6',
    }}>
      {/* 좌측 브랜드 패널 */}
      <div style={{
        width: '420px',
        flexShrink: 0,
        background: 'linear-gradient(160deg, #111111 0%, #1E1E1E 50%, #2A2A2A 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 장식 요소 */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '300px', height: '300px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '240px', height: '240px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '400px', height: '400px', borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.015)',
        }} />

        {/* 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <div style={{
            width: '36px', height: '36px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}>
            스튜디오
          </span>
        </div>

        {/* 중앙 카피 */}
        <div style={{ position: 'relative' }}>
          <h2 style={{
            fontSize: '26px', fontWeight: '700', color: 'white',
            lineHeight: '1.35', letterSpacing: '-0.03em', margin: '0 0 16px',
          }}>
            콘텐츠를 더 쉽게,<br/>더 빠르게.
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.75' }}>
            블로그 포스트를 작성하고, 예약 발행하고,<br/>
            외부 서비스에 콘텐츠를 공급해요.
          </p>
        </div>

        {/* 하단 */}
        <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.25)', position: 'relative' }}>
          Studio Admin v1.0
        </div>
      </div>

      {/* 우측 폼 영역 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        backgroundColor: '#FFFFFF',
      }}>
        {children}
      </div>
    </div>
  )
}
