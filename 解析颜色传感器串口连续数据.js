import { promises as fs } from "fs";
import fs_extra from "fs-extra";
import path from "path";
import process from "process";
import { uniqBy } from "lodash-es";

async function* readLines(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const lines = data.split("\n");
    for (const line of lines) {
      //   console.log(line);
      yield line;
    }
  } catch (error) {
    // console.error(`Error reading file: ${error.message}`);
    throw error;
  }
}
async function main() {
  for (const file of process.argv.slice(2)) {
    console.log(file);
    // 使用函数
    const result = [];

    let data = {};
    for await (
      const line of readLines(
        file,
      )
    ) {
      if (
        line.startsWith("[DRIVER_TASK----LRE_381]light on states get red :")
      ) {
        data = {};
        // console.log(line);

        data.red = Number(
          line.slice(
            "[DRIVER_TASK----LRE_381]light on states get red :".length,
          ),
        );
      }
      if (
        line.startsWith("[DRIVER_TASK----LRE_381]light on states get green :")
      ) {
        // console.log(line.slice(
        //   "[DRIVER_TASK----LRE_381]light on states get green :".length,
        // ))
        // console.log(line);
        data.green = Number(
          line.slice(
            "[DRIVER_TASK----LRE_381]light on states get green :".length,
          ),
        );
      }
      if (
        line.startsWith("[DRIVER_TASK----LRE_381]light on states get blue :")
      ) {
        // console.log(line);
        data.blue = Number(
          line.slice(
            "[DRIVER_TASK----LRE_381]light on states get blue :".length,
          ),
        );
        result.push(data);
        // data = {};
      }
    }
    const resset = uniqBy(result, (item) => JSON.stringify(item));
    // console.log(JSON.stringify(resset));
    const output = path.resolve(
      path.dirname(file),
      path.basename(file, ".txt") + ".json",
    );
    await fs_extra.writeJSON(output, resset, {
      // spaces: 2,
    });
    console.log(output);
  }
}
main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
