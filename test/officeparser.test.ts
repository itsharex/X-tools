import {OfficeParser} from 'officeparser';
import * as fs from 'fs';
import * as path from 'path';

async function testOfficeParser() {
    console.log('测试 officeparser 库的能力...\n');

    // 获取 test/files 目录下的所有文件
    const testDir = path.join('test', 'files');
    const files = fs.readdirSync(testDir);

    for (const file of files) {
        const filePath = path.join(testDir, file);
        const ext = path.extname(file).toLowerCase();

        // 只测试Office文档格式
        // if (['.docx', '.xlsx', '.pptx'].includes(ext)) {
        if (['.pptx'].includes(ext)) {
            console.log(`正在解析文件: ${file}`);
            console.log('='.repeat(40));

            try {
                // 使用 OfficeParser 解析
                const contentAST = await OfficeParser.parseOffice(filePath, {extractAttachments: true, includeRawContent: false});

                console.log(`文件类型: ${contentAST.type || 'Unknown'}`);
                console.log(`元数据:`, contentAST.metadata ? JSON.stringify(contentAST.metadata, null, 2) : 'None');

                // 显示内容结构
                // if (Array.isArray(contentAST.content)) {
                //     console.log(`内容数组长度: ${contentAST.content.length}`);
                //     contentAST.content.forEach((item, index) => {
                //         console.log(`内容项 ${index + 1}:`, typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item));
                //     });
                // } else if (typeof contentAST.content === 'object') {
                //     console.log('内容对象:', JSON.stringify(contentAST.content, null, 2));
                // } else {
                //     console.log('内容 (字符串):', typeof contentAST.content === 'string' ? (contentAST.content as string) : contentAST.content);
                // }
                //
                if (contentAST.attachments) {
                    console.log('附件')
                    contentAST.attachments.forEach((item, index) => {
                        console.log(index, typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item));
                    })
                }

                console.log("内容 AST：")
                console.log(JSON.stringify(contentAST, null, 2));

                // 获取纯文本
                console.log(`纯文本内容:`);
                console.log(contentAST.toText());

                console.log('');
            } catch (error) {
                console.error(`解析文件 ${file} 时出错:`, error);
                console.log('');
            }
        }
    }

    console.log('测试完成！');
}

// 运行测试
testOfficeParser().catch(console.error);

export {};