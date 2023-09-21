import { DBManager } from "./database/dbManager";

const dbManager = DBManager.getInstance();

function getQuiz(url: URL): Response {
  const quizId = url.searchParams.get("id");
  if (quizId) {
    const quiz = dbManager.getQuiz(quizId);
    if (!quiz) return new Response("Not Found", { status: 404 });
    return new Response(JSON.stringify(quiz), { status: 200 });
  }

  return new Response("Not Found", { status: 404 });
}

function getQuizzes(): Response {
  const quizzes = dbManager.getQuizzes();
  return new Response(JSON.stringify(quizzes), { status: 200 });
}

async function fetchPage(req: Request) {
  const url = new URL(req.url);
  if (url.pathname == "/") return new Response("Not Found", { status: 404 });
  if (url.pathname == "/hello")
    return new Response("Hello World", { status: 200 });
  if (url.pathname == "/getQuiz") return getQuiz(url);
  if (url.pathname == "/getQuizzes") return getQuizzes();
  if (url.pathname == "/clear") {
    dbManager.clearDatabase();
    return new Response("OK", { status: 200 });
  }
  if (url.pathname == "/createTestQuiz") {
    const quiz = dbManager.createTestQuiz();
    return new Response(JSON.stringify(quiz.id), { status: 200 });
  }
  if (url.pathname == "/createQuiz" && req.method == "POST") {
    
    
    const quiz = await req.json();
    if(!quiz.created) quiz.created = new Date();
    if(!quiz.modified) quiz.modified = new Date();
    
    const quizId = dbManager.createQuiz(quiz);

    return new Response(JSON.stringify({id: quizId.id}), { status: 200 });
  }

  return new Response(`Hello ${url.searchParams.get("name") || "World"}`, {
    status: 200,
  });
}

Bun.serve({
  async fetch(req) {
    const res = await fetchPage(req);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "*");
    res.headers.set("Access-Control-Allow-Headers", "*");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    return res;
  },
  error(e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log("Server started at http://localhost:3000");
