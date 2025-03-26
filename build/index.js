#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const CHOICES = fs_1.default.readdirSync(`${__dirname}/templates`);
const CURR_DIR = process.cwd();
const args = process.argv.slice(2);
const command = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
const template = args[1];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (command === 'setup' && template) {
            const matchedTemplate = CHOICES.find((choice) => choice.toLowerCase() === template);
            if (!matchedTemplate) {
                console.log(`Template "${template}" not found. Available templates are:`);
                CHOICES.forEach((choice) => console.log(`-${choice}`));
                process.exit(1);
            }
            const projectName = template === 'node'
                ? 'node-express-app'
                : template === 'react'
                    ? 'react-app'
                    : `${template}-app`;
            createProject(matchedTemplate, projectName);
        }
        else {
            const answers = yield inquirer_1.default.prompt([
                {
                    name: 'project-choice',
                    type: 'list',
                    message: 'which project template would you like',
                    choices: CHOICES,
                },
                {
                    name: 'project-name',
                    type: 'input',
                    message: 'Project Name : ',
                    validate: function (input) {
                        if (/^([A-Za-z\-\_\d])+$/.test(input))
                            return true;
                        else
                            return 'Project name may only include letters, numbers, underscores and hashes.';
                    },
                },
            ]);
            const projectChoice = answers['project-choice'];
            const projectName = answers['project-name'];
            createProject(projectChoice, projectName);
        }
    });
}
function createProject(templateName, projectName) {
    const templatePath = `${__dirname}/templates/${templateName}`;
    const targetPath = `${CURR_DIR}/${projectName}`;
    console.log(`\nCreating new ${templateName} project in ${targetPath}...`);
    //project dir creations
    fs_1.default.mkdirSync(targetPath, { recursive: true });
    createDirectoryContents(templatePath, projectName);
    try {
        console.log('\nInitializing git repository...');
        (0, child_process_1.execSync)('git init', { cwd: targetPath, stdio: 'ignore' });
        console.log('Installing node modules...');
        (0, child_process_1.execSync)('npm install', { cwd: targetPath, stdio: 'inherit' });
        console.log(`\n Project created successfully!`);
        console.log(`\nTo get started:`);
        console.log(`  cd ${projectName}`);
        console.log(`  npm start\n`);
    }
    catch (error) {
        console.error('An error occurred during setup : ', error.message);
    }
}
// const QUESTIONS: any = [
//   {
//     name: 'project-choice',
//     type: 'list',
//     message: 'What project template would you like to generate?',
//     choices: CHOICES,
//   },
//   {
//     name: 'project-name',
//     type: 'input',
//     message: 'Project name:',
//     validate: function (input: any) {
//       if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
//       else
//         return 'Project name may only include letters, numbers, underscores and hashes.';
//     },
//   },
// ];
// inquirer.prompt(QUESTIONS).then((ans) => {
//   const projectChoice = ans['project-choice'];
//   const projectName = ans['project-name'];
//   const templatePath = `${__dirname}/templates/${projectChoice}`;
//   fs.mkdirSync(`${CURR_DIR}/${projectName}`);
//   createDirectoryContents(templatePath, projectName);
// });
function createDirectoryContents(templatePath, newProjectPath) {
    const fileToCreate = fs_1.default.readdirSync(templatePath);
    fileToCreate.forEach((file) => {
        const ogFilePath = `${templatePath}/${file}`;
        const stats = fs_1.default.statSync(ogFilePath);
        if (stats.isFile()) {
            const contents = fs_1.default.readFileSync(ogFilePath, 'utf8');
            if (file === '.npmignore')
                file = '.gitignore';
            const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
            fs_1.default.writeFileSync(writePath, contents, 'utf8');
        }
        else if (stats.isDirectory()) {
            fs_1.default.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);
            createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
        }
    });
}
main().catch(console.error);
