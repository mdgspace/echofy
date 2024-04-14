import axios from "axios";
import { projectURLbuildr } from "../url-builder/url-builder";
export const fetchProjects = async () => {
  try {
    const url = projectURLbuildr();
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    //todo -> enable sentry logger here
  }
};
