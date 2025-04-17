import axios from "axios";
import { projectURLbuildr } from "../url-builder/url-builder";

import { FetchProjectsResponse, Project } from "../../interface/interface";

export const fetchProjects = async (): Promise<FetchProjectsResponse | undefined> => {
  try {
    const url = projectURLbuildr();
    const res = await axios.get<FetchProjectsResponse>(url);
    return res.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    // todo -> enable sentry logger here
    return undefined; // Handle error as needed
  }
};

