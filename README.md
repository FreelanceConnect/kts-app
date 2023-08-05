# kts-app

### Note: Please skip 1 to 4 if you are working on the UI

**Description**: A brief description of your project.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
  - [Configuring Amplify Backend](#configuring-amplify-backend)
- [Development](#development)
  - [Branching Strategy](#branching-strategy)
  - [Running the App](#running-the-app)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before setting up the project, ensure that you have the following tools installed on your development machine:

- [Node.js](https://nodejs.org) (LTS version recommended)
- [npm](https://www.npmjs.com/) (Node Package Manager, usually comes with Node.js installation)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (Expo Command Line Interface)
- [Git](https://git-scm.com/)

### Installing Dependencies

1. Clone the repository from GitHub:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd project-directory
```

3. Install project dependencies:

```bash
npm install
```

### Configuring Amplify Backend

To work with the Amplify backend, you'll need to set up the necessary AWS credentials and configure the backend environment.

1. Install and configure the AWS Amplify CLI:

```bash
npm install -g @aws-amplify/cli
amplify configure
```

2. Initialize the Amplify project:

```bash
amplify init
```

Follow the prompts to set up your Amplify backend environment.

3. Add necessary backend resources using the Amplify CLI (e.g., authentication, storage, API):

```bash
amplify add auth
amplify add storage
amplify add api
```

Follow the prompts and configure the backend resources accordingly.

4. Deploy the backend resources to the cloud:

```bash
amplify push
```

The backend resources will be created in your AWS account.

## Development

### Branching Strategy

We follow the **feature branch** git flow for development. Developers should create their feature branches from the `develop` branch using the following convention:

```bash
git checkout -b feature/feature-name develop
```

### Running the App

To run the app locally in development mode, use Expo CLI:

```bash
expo start
```

Expo DevTools will open in your browser, and you can choose to run the app on a simulator or a physical device using the Expo Go app.

## Deployment

The app is automatically deployed to Expo for each merge into the `main` branch. You can access the live version of the app at [Expo Project URL](https://expo.dev/@username/project-name).

## Contributing

Please follow the feature branch git flow and submit pull requests into the `develop` branch. Ensure that your code follows the project's coding standards and includes appropriate tests where necessary.

For any major changes or significant features, discuss with the team and open an issue before starting the implementation.

## License

This project is licensed under the [License Name](LICENSE).

--- 

In this modified version, I've updated the branching strategy to specify that developers should create their feature branches from the `develop` branch, which is a common practice in many development workflows like Gitflow. This helps keep the `main` branch stable and ready for production releases while developers work on their features in the `develop` branch.


You have enabled SMS based auth workflow. Verify your SNS account mode in the SNS console: https://console.aws.amazon.com/sns/v3/home#/mobile/text-messaging
If your account is in "Sandbox" mode, you can only send SMS messages to verified recipient phone numbers.