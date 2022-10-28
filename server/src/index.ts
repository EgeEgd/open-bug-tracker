import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import dotenv from "dotenv";
dotenv.config();

import EventsController from "./controllers/events.controller";
import ProjectController from "./controllers/projects.controller";
import { Context } from "vm";
import { nextTick } from "process";
import BugsController from "./controllers/bugs.controller";

const app = new Koa();
const port = process.env.PORT || 8080;

const router = new Router();
var options = {
  origin: "*",
};

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  await next();
});

app.use(cors(options));
app.use(bodyParser());

router.post("/events", EventsController.createEvent);
router.post("/projects", ProjectController.createProject);

router.get("/bugs", BugsController.getBugs);
router.get("/bugs/:id", BugsController.getBug);
router.put("/bugs/:id/solve", BugsController.updateBug);

router.get("/projects", ProjectController.getProjects);
router.get("/project/:id", ProjectController.getProject);

router.get("/bugs/:id/ocurrence/:id", EventsController.getEvent);

app.listen(port, () => {
  console.log(`🚀 Server listening ${port} 🍟 🚀`);
});

app.on("error", async (err, ctx: Koa.Context, next: Koa.Next) => {
  console.log(err);
  await next();
});

app.use(router.routes());
