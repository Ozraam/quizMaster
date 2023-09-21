import { clearDatabase, createQuiz, getQuiz, getQuizzes } from "./src/API";
import { Router } from "./src/Router";

const router = new Router();

// API
router.addRoute('/API/getQuiz', getQuiz);
router.addRoute('/API/getQuizzes', getQuizzes);
router.addRoute('/ADMIN/clear', clearDatabase);
router.addRoute('/API/createQuiz', createQuiz);

// Quiz Master
router.useDirectory('/', './public/quizMaster/');
router.addFavIcon('/favicon.ico', './public/quizMaster/favicon.ico');
router.useDirectory('/fonts/', './public/quizMaster/fonts/');

router.useDirectory('/quiz/', './public/quizMaster/quiz/');
router.useDirectory('/create/', './public/quizMaster/create/');

Bun.serve({
  async fetch(req) {
    const res = await router.fetch(req);
    return res;
  },
  error(e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log("Server started at http://localhost:3000");
