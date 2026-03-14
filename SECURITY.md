# Security Policy

## Supported Versions

Ozigi is currently in active development. We provide security updates for the latest stable release and the current beta branch.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of Ozigi and our users' data extremely seriously. If you believe you have found a security vulnerability, please help us fix it by reporting it responsibly.

**Please do not report security vulnerabilities via public GitHub issues.**

### How to report a vulnerability
Please send an email to **[Your Email Address Here]** with the subject line `SECURITY VULNERABILITY: [Brief Description]`. 

To help us act quickly, please include:
* A detailed description of the vulnerability.
* Steps to reproduce the issue (PoC scripts or screenshots are highly appreciated).
* The potential impact if exploited.

### What to expect
* **Acknowledgement:** You will receive an initial response within **48 hours** confirming we have received the report.
* **Updates:** We will provide status updates at least every **72 hours** while the vulnerability is being investigated and patched.
* **Disclosure:** Once a fix is deployed, we will coordinate with you to determine if and how the vulnerability should be publicly disclosed.

## Our Security Architecture

Ozigi implements several layers of defense to protect user data and system integrity:
* **LLM Layer:** Strict token-level constraints via the Banned Lexicon and automated Prompt Injection scanning.
* **Database Layer:** Row Level Security (RLS) enforced on all tables, ensuring users can only access their own data.
* **Infrastructure:** Rate limiting via Upstash to prevent denial-of-service and budget exhaustion.
* **Automated Scanning:** CI/CD integration with CodeQL for continuous static analysis of the codebase.