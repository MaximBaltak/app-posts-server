import { DataSource } from "typeorm"
import { connectionDB } from "./tyoeorm.config";

const AppDataSource: DataSource = new DataSource({ ...connectionDB })
export default AppDataSource
