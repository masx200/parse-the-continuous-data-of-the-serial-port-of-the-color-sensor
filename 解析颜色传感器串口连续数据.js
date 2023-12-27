// 导入fs模块的promises别名
import { promises as fs } from "fs";
// 导入fs-extra模块
import fs_extra from "fs-extra";
// 导入path模块
import path from "path";
// 导入process模块
import process from "process";
// 导入lodash-es中的uniqBy函数
import { uniqBy } from "lodash-es";

// 生成器函数，异步读取文件并逐行返回
async function* readLines(filePath) {
    try {
        // 读取文件内容
        const data = await fs.readFile(filePath, "utf8");
        // 按行分割文件内容
        const lines = data.split("\n");
        // 遍历每一行并返回
        for (const line of lines) {
            // console.log(line);
            yield line;
        }
    } catch (error) {
        // console.error(`Error reading file: ${error.message}`);
        throw error;
    }
}

// 主函数
async function main() {
    // 遍历命令行参数中的文件
    for (const file of process.argv.slice(2)) {
        console.log(file);

        // 初始化结果数组
        const result = [];
        let data = {};

        // 使用生成器函数读取文件并处理每一行
        for await (const line of readLines(file)) {
            if (
                line.startsWith(
                    "[DRIVER_TASK----LRE_381]light on states get red :",
                )
            ) {
                data = {};
                data.red = Number(
                    line.slice(
                        "[DRIVER_TASK----LRE_381]light on states get red :"
                            .length,
                    ),
                );
            }
            if (
                line.startsWith(
                    "[DRIVER_TASK----LRE_381]light on states get green :",
                )
            ) {
                data.green = Number(
                    line.slice(
                        "[DRIVER_TASK----LRE_381]light on states get green :"
                            .length,
                    ),
                );
            }
            if (
                line.startsWith(
                    "[DRIVER_TASK----LRE_381]light on states get blue :",
                )
            ) {
                data.blue = Number(
                    line.slice(
                        "[DRIVER_TASK----LRE_381]light on states get blue :"
                            .length,
                    ),
                );
                result.push(data);
                // data = {};
            }
        }

        // 去重并筛选出包含red、green、blue属性的对象
        const resset = uniqBy(
            result.filter((a) =>
                Number.isFinite(a.red) && Number.isFinite(a.green) &&
                Number.isFinite(a.blue)
            ),
            (item) => JSON.stringify(item),
        );

        // 计算输出文件路径
        const output = path.resolve(
            path.dirname(file),
            path.basename(file, ".txt") + ".json",
        );

        // 将结果写入JSON文件
        await fs_extra.writeJSON(output, resset, {
            // spaces: 2,
        });

        console.log(output);
    }
}

// 执行主函数并处理异常
main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
