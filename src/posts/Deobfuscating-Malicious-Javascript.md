---
title: Deobfuscating Malicious JavaScript in Phishing Emails
tag: Malware Analysis
date: 2024-01-15
readTime: 10 min
excerpt: A walkthrough of analysing and deobfuscating heavily obfuscated JavaScript payloads found in phishing email attachments targeting Outlook OAuth credentials.
mitre: T1027 - Obfuscated Files or Information, T1566.001 - Phishing: Spearphishing Attachment
---

Today's topic is driven by a surge in specific email inquiries I've handled in my daily tasks. Typically, these emails come with an attached HTML file. Upon closer inspection, these files often hide a JavaScript payload, which is the adversary's tool to execute their malicious plans.

The prime objective here is the harvesting of Outlook credentials. The crown jewel for these adversaries is the user's OAuth token, which is frequently procured through sophisticated adversary-in-the-middle attacks (AITM).

In this piece, I aim to shed light on the analysis of intricately obfuscated code, guiding you through the process of unmasking the hidden malicious intent.

## Deobfuscation

To give you a vivid picture of what we're dealing with, the screenshot below is an authentic representation of how the code appeared in its original form, extracted straight from the HTML file. The layers of obfuscation and complexity are evident at first glance.

![Malicious JavaScript -- original obfuscated form](/images/malicious-heavy-obf.png)

To begin, the code has been URL encoded as part of evading detections. We can proceed to CyberChef and decode this to a more readable form.

![URL decoded output in CyberChef](/images/url-encoded-output.png)

Having gotten our hands on a decipherable version of the code, we can use the [de4js tool](https://lelinhtinh.github.io/de4js/) to give it a neat makeover. While this is my tool of choice, there are several other viable alternatives -- the browser console or `js-beautify` available on REMnux serve the purpose just as well.

![Code after formatting with de4js](/images/code-look-de4js.png)

With the code now formatted, the next step is to comb through the legible script searching for any errors or glitches that could disrupt execution. Use an online JavaScript validator to check for errors.

![JavaScript validator showing errors](/images/errors.png)

After formatting, the validator tells us exactly where each mistake is -- which line and which position on that line. This makes fixing things significantly easier. Tools like ChatGPT or Snyk can also help find and fix these mistakes automatically.

After tidying up the code, we can use [willnode deobfuscator](https://willnode.github.io/deobfuscator/) to remove hex names, resolve mathematically calculated values and variables, and decode any encoded strings.

After running the code through the tool and applying manual corrections, here's how it turned out.

![Code after deobfuscation -- readable values restored](/images/changes-to-readable-values.png)

With things tidied up, it's time to dive deeper and fully deobfuscate the code. Below are two methods that work well.

### USING JSTILLERY

A Linux command line tool that uses AST (Abstract Syntax Tree) and partial evaluation to deobfuscate code.

Given a file containing obfuscated JavaScript, the tool deobfuscates by performing partial eval and traversing the AST tree as an interpreter would.

![jstillery deobfuscation results](/images/results-of-jstillery.png)

### ACTIVE DEOBFUSCATION USING ONLINE EMULATOR

One of the most reliable methods is using [Synchrony](https://deobfuscate.relative.im/) to perform deobfuscation. This tool uses partial eval and other deobfuscation techniques to unwrap code and produce a fully readable result.

The screenshot below shows our code after cleaning and correcting, but still containing `parseInt()` and `push()`/`pop()` instructions that are still performing obfuscation.

![Code before Synchrony deobfuscation](/images/before-deo.png)

Submit the JavaScript to the site and click deobfuscate. Make the browser console your friend during this process -- use it to debug any errors that prevent successful deobfuscation. The log tab will also indicate if deobfuscation has failed.

![Synchrony deobfuscation log](/images/synchrony-log.png)

After deobfuscation, the code is well-arranged with all variables resolved and looking close to the original pre-obfuscated version.

![Code after Synchrony deobfuscation](/images/after-deobfuscation.png)

![Deobfuscated code -- full view](/images/after-de.png)

From here, we can pick IOCs one by one and conduct further analysis.

## Emulating JavaScript Code

### USING THE BROWSER CONSOLE

Both Chrome and Firefox have a built-in developer toolbar that provides tools for emulating and debugging JavaScript. To get verbose feedback on what the code is doing, add `console.log()` on all return statements to log the values returned after various operations.

The screenshot below shows a different phishing code example with logging added to various return values.

![Phishing code with console.log statements added](/images/console-run-code.png)

Running this in the browser console logs each value as shown below.

![Browser console output showing logged values](/images/results-console.png)

### EMULATING USING SPIDERMONKEY

SpiderMonkey is a C-based JavaScript engine developed by Mozilla. It acts as a standalone JavaScript interpreter, allowing you to run JavaScript directly from a Linux command line without needing a browser. This provides a more controlled environment to run and inspect unfamiliar JavaScript code.

To emulate JavaScript using SpiderMonkey:

1. Extract the JavaScript content -- everything inside the `<script>` tags, excluding the tags themselves -- and save it to a separate file
2. If the code contains an `eval` command, insert `eval = print;` at the start of the script -- this causes `eval` to display its input instead of executing it
3. Execute the modified script using SpiderMonkey

![SpiderMonkey emulating the phishing script](/images/same-results-as-console-spidermonkey.png)

![SpiderMonkey output -- same result as browser console](/images/same-output-as-console-spidermonkey.png)

SpiderMonkey produces the same output as the browser console, but executes entirely on the Linux terminal.

## Conclusion

We covered how to clean JavaScript code, deobfuscate it using both automated tools and manual correction, and emulate it safely using the browser console and SpiderMonkey. To emphasise -- make the browser console your primary debugging tool. It saves significant time that would otherwise go into searching for solutions.

## Resources

- [de4js -- JavaScript Deobfuscator and Unpacker](https://lelinhtinh.github.io/de4js/)
- [Synchrony -- JavaScript Deobfuscator](https://deobfuscate.relative.im/)
- [JavaScript Validator](https://www.commontools.org/tool/javascript-validator-79)
- [Willnode Deobfuscator](https://willnode.github.io/deobfuscator/)
- [CyberChef](https://gchq.github.io/CyberChef/)