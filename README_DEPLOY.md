# Deployment Guide (GitHub + Vercel + Supabase)

## 1) Git 초기화 및 첫 커밋
```powershell
git init
git add .
git commit -m "chore: initial website setup"
```

## 2) GitHub 원격 연결
```powershell
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## 3) Vercel 배포 (GitHub 연동 추천)
1. Vercel Dashboard > Add New > Project
2. GitHub 저장소 선택
3. Framework Preset: Other
4. Root Directory: `./`
5. Build Command 비움 (정적 사이트)
6. Output Directory 비움 (정적 사이트)
7. Deploy

## 4) Supabase 프로젝트 생성
1. Supabase Dashboard > New project
2. 프로젝트 생성 후 `Project URL`, `anon public key`, `service_role key` 확인
3. SQL Editor에서 [supabase/inquiry_logs.sql](supabase/inquiry_logs.sql) 내용을 실행해 `inquiry_logs` 테이블 생성
4. 이 사이트는 브라우저에서 직접 DB에 쓰지 않고, Vercel Serverless API가 대신 기록합니다.

## 5) Vercel 환경변수 설정
Vercel Project > Settings > Environment Variables
- `SUPABASE_URL` = your project URL
- `SUPABASE_ANON_KEY` = your anon key
- `SUPABASE_SERVICE_ROLE_KEY` = your service role key

적용 후 Redeploy

## 6) 로컬에서 Vercel CLI로 배포 (선택)
```powershell
npx vercel login
npx vercel
npx vercel --prod
```

## 7) 도메인 연결 (선택)
Vercel Project > Settings > Domains에서 커스텀 도메인 추가

## Notes
- 현재 사이트는 정적 HTML/CSS/JS라서 빌드 단계 없이 바로 배포됩니다.
- 모바일 페이지는 `m.index.html` 등으로 직접 접근 가능합니다.
- 문의/연락 페이지는 `/api/qna-contact`를 통해 Supabase `inquiry_logs` 테이블에 접속 로그를 저장합니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 반드시 Vercel 서버 환경변수에만 넣고, 프론트엔드 코드에는 넣지 않습니다.
