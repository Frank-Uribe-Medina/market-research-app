## TECHS

- NodeJS
- NextJS
- Firestore
- Firebase Auth
- Material UI
- Linting
- Typescript
- Unit Testing
- Husky pre commit

## USING AS BASE

```bash
git clone {repo_url}
rename nextjs-js-boilerplate directory to {project_name}
change package.json "name: next-js-boilerplate" to "name: {project_name}"
cd {project_name}
npm install
*IMPORTANT: do PRE REQ step first.
git add .
git commit -m "{message}"
git remote set-url origin {new_repo_here}
git branch -M main
git push origin main
```

## PRE REQ

```bash
npm install
cp env.example .env
*IMPORTANT: change cookie name in '/lib/db/initAuth'
```

## Getting Started

First, run the development server:
Make sure to use proper .env values from firebase

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
