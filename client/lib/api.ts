import axios from "axios";

import type { NextApiRequest, NextApiResponse } from "next";
import { config } from "process";

interface Data {
  name: string;
}

function handler(req: NextApiRequest, res: NextApiResponse<Data>): void {
  res.status(200).json({ name: "John Doe" });
}

const api = axios.create({
  baseURL: "http://localhost:8080",
});

interface Project {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
}

interface Projectwithbugs {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
  bugs: any;
}

const APIprojects = {
  async postProjects(project: string) {
    try {
      return await api.post("/projects", {
        name: project,
      });
    } catch (error) {
      console.log(error);
    }
  },
  async getProjects() {
    try {
      return await api.get<Project[]>("/projects");
    } catch (error) {
      console.log(error);
    }
  },
  async getProject(id: string) {
    try {
      const result = await api.get<Projectwithbugs>(`/project/${id}`);
      console.log(result);
      console.log("hi");
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};

export { handler, api, APIprojects };
