#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { create } from 'domain';

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURR_DIR = process.cwd();

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();
const template = args[1];

async function main() {
  if (command === 'setup' && template) {
    const matchedTemplate = CHOICES.find(
      (choice) => choice.toLowerCase() === template
    );
    if (!matchedTemplate) {
      console.log(`Template "${template}" not found. Available templates are:`);
      CHOICES.forEach((choice) => console.log(`-${choice}`));
      process.exit(1);
    }
    const projectName =
      template === 'node'
        ? 'node-express-app'
        : template === 'react'
        ? 'react-app'
        : `${template}-app`;
    createProject(matchedTemplate, projectName);
  } else {
    const answers = await inquirer.prompt([
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
          if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
          else
            return 'Project name may only include letters, numbers, underscores and hashes.';
        },
      },
    ]);
    const projectChoice = answers['project-choice'];
    const projectName = answers['project-name'];

    createProject(projectChoice, projectName);
  }
}

function createProject(templateName: String, projectName: String) {
  console.log(typeof(templateName), typeof(projectName))
  const templatePath = `${__dirname}/templates/${templateName}`;
  const targetPath = `${CURR_DIR}/${projectName}`;

  console.log(`\nCreating new ${templateName} project in ${targetPath}...`);

  //project dir creations
  fs.mkdirSync(targetPath, { recursive: true });
  createDirectoryContents(templatePath, projectName);

  try {
    console.log('\nInitializing git repository...');
    execSync('git init', { cwd: targetPath, stdio: 'ignore' });
    console.log('Installing node modules...');
    execSync('npm install', { cwd: targetPath, stdio: 'inherit' });
    console.log(`\n Project created successfully!`);
    console.log(`\nTo get started:`);
    console.log(`  cd ${projectName}`);
    console.log(`  npm start\n`);
  } catch (error: any) {
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

function createDirectoryContents(templatePath: any, newProjectPath: any) {
  const fileToCreate = fs.readdirSync(templatePath);

  fileToCreate.forEach((file) => {
    const ogFilePath = `${templatePath}/${file}`;

    const stats = fs.statSync(ogFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(ogFilePath, 'utf8');
      if (file === '.npmignore') file = '.gitignore';
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  });
}
main().catch(console.error);
