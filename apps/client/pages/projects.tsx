/** @format */

import { GetServerSideProps, NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";
import FormProject from "../components/newProject";
import { APIprojects, setToken } from "../lib/api";
import { UseUser } from "../lib/auth";
import styles from "../styles/Projects.module.css";
import qs from "qs";
import Router from "next/router";
import { Cookies } from "next/dist/server/web/spec-extension/cookies";

interface Project {
  id: number;
  name: string;
  bugs_count_active: number;
  bugs_count_total: number;
}

function Projects({}: GetServerSideProps): JSX.Element {
  const [newProjects, setNewProjects] = useState<Project[]>([]);

  UseUser();

  const createProject = async function (projectInput: string) {
    const result = await APIprojects.postProjects(projectInput);
    const project = result?.data;
    return setNewProjects((projects) =>
      projects.concat(...newProjects, project)
    );
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>PROJECTS</h1>
        <FormProject onSubmit={createProject}> </FormProject>
        <div className={styles.list}>
          {newProjects.length > 1 &&
            newProjects.map((project: Project) => {
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className={styles.element}>
                    <div className={styles.upBox}>
                      <h3 className={styles.subTitle}>{project.name}</h3>

                      {project.bugs_count_active < 1 && (
                        <div className={styles.solved}> SOLVED</div>
                      )}
                      {project.bugs_count_active > 0 && (
                        <div className={styles.toFix}> TO FIX</div>
                      )}
                    </div>
                    <div className={styles.subBox}>
                      <div className={styles.idTitle}>
                        Project id: {project.id}
                      </div>
                      <div>
                        {project.bugs_count_active} active{" "}
                        {`bug${project.bugs_count_active === 1 ? "" : "s"}`},
                        total {project.bugs_count_total}{" "}
                        {`bug${project.bugs_count_total === 1 ? "" : "s"}`}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
}

export default Projects;

//getServerside props even if there is no props
export async function getServerSideProps(context: NextPageContext) {
  const { token } = context.query;
  const cookies = new Cookies(context.req);
  const bearer = cookies.get("token");
  if (typeof token === "string") {
    setToken(token);
    cookies.set("token", token);
  } else if (typeof bearer === "string") {
    setToken(bearer);
  }

  const result = await APIprojects.getProjects();
  const projects = result;

  // if there is not projects return dummy data
  if (!projects) {
    return {
      props: {
        projects: {
          id: 1,
          name: "Project 1",
          bugs_count_active: 0,
          bugs_count_total: 0,
        },
      },
    };
  }

  return {
    props: {
      projects: result,
    },
  };
}
