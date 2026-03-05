---
title: Polyglot PDFs Embedded with MalDoc/ActiveMime
tag: Malware Analysis
date: 2023-08-30
readTime: 8 min
excerpt: Analysis of a technique reported by JPCERT where polyglot PDF files embed malicious ActiveMime/VBA macros that execute when opened in Microsoft Word.
mitre: T1027 - Obfuscated Files or Information, T1566.001 - Phishing: Spearphishing Attachment, T1059.005 - Visual Basic
---

Recently, a new technique to create **polyglot PDFs embedded with maldoc** was reported by **JPCERT**. The file can be opened in Microsoft Word even though it carries the magic header and structures of a PDF file. If the embedded file is configured with VBA, the macro will execute upon opening in Word. Didier Stevens released a new version of **emldump** to help parse this kind of PDF file.

The samples analysed are:

- `01ac13cec301f1b6b60639cce4935b972701a72bd602d9ceeb6eb2827ab89a36`
- `5b677d297fb862c2d223973697479ee53a91d03073b14556f421b3d74f136b9d`
- `ef59d7038cfd565fd65bae12588810d5361df938244ebad33b71882dcf683058`

![PDF file identification](/images/pdf-identification.png)

## Analysis

### Step 1 -- Identification

Use **pdfid** to gain initial information about the samples.

![PDFID output for all samples](/images/pdfid-for-all-pdfs.png)

### Step 2 -- Entropy Check

Inspect the entropy of structural components with **pdfid**. An unusually high count of bytes outside the PDF streams may indicate a suspicious file.

![PDFID entropy check across all samples](/images/pdfid-entropy-of-all-samples.png)

### Step 3 -- Extraction

Use the extra flag for **emldump** to view the initial characters of each part. The ActiveMime component will have a header labelled `activeMime`.

![ActiveMime detection via emldump](/images/activex-detect-emldump.png)

### Step 4 -- Dumping

Use **emldump** to extract components. The output file will contain the ActiveMime component.

![Dumping ActiveMime component](/images/dump-activemime.png)

### Step 5 -- OLE Investigation

With the dumped ActiveMime files in hand, use **oledump** to dive deeper. The ActiveMime files contain a macro stream identifiable by the **M** marker beside the stream.

![oledump showing VBA macro stream](/images/oledump-vba-stream.png)

### Step 6 -- VBA Extraction

Extract the VBA streams from the ActiveMime files using **oledump**. The macro content reveals the malicious actions the maldoc aims to execute.

![VBA macro from 5b sample](/images/5b_macro.png)

![VBA macro from 01ac sample](/images/01_macro.png)

Further analysis will be warranted depending on the complexity of the uncovered macro code.

## Alternative Analysis Path

### Step 1 -- OLE Parsing

Use **oleid** to treat the PDF files as OLE files directly.

![oleid output for 5b sample](/images/oleid-for-malpolyglot5a.png)

![oleid output for 01ac sample](/images/01ac-oleid.png)

### Step 2 -- VBA Analysis with olevba

Use **olevba** to examine the VBA content. This may include resources such as PNGs and JPEGs encoded in base64. The ActiveMime component appears as any other embedded resource -- base64 encoded data labelled as a JPEG. This label helps narrow down which base64 block to decode.

![ActiveMime component labelled as JPEG](/images/activemime-named-as-jpeg.png)

The screenshot below shows how olevba parses the extra bytes as macro content.

![olevba parsing PDF structure as macro](/images/detected-pdf-structure-as-macro.png)

In our samples, the ActiveMime component base64 data appears jumbled with long whitespaces interspersed between chunks.

![Jumbled base64 output from olevba](/images/jumbled-olevba.png)

### Step 3 -- Decoding

Decode the base64 encoded data using **CyberChef** to retrieve the ActiveMime component, then proceed with further analysis using olevba on the extracted file.

![CyberChef decoding the ActiveMime base64](/images/cyerchef-decode-activemime.png)

## Conclusion

Polyglot PDF/MalDoc files are a subtle but effective delivery mechanism. The key takeaway is that file extension and magic bytes alone are insufficient for classification -- the embedded structure must be inspected. Tools like pdfid, emldump, oledump, oleid, and olevba give you the full picture when used together.

A detection rule for this technique is available at [mystickev/Detections-rules-IOCs](https://github.com/mystickev/Detections-rules-IOCs/tree/main/YARA-rules).

## References

- [JPCERT -- MalDoc in PDF](https://blogs.jpcert.or.jp/en/2023/08/maldocinpdf.html)
- [Didier Stevens -- Analysis of PDF ActiveMime Polyglot MalDocs](https://blog.didierstevens.com/2023/08/29/quickpost-analysis-of-pdf-activemime-polyglot-maldocs/)
- [Didier Stevens -- emldump.py v0.0.12](https://blog.didierstevens.com/2023/08/29/update-emldump-py-version-0-0-12/)
- [oletools -- oleid](https://github.com/decalage2/oletools/wiki/oleid)
- [oletools -- olevba](https://github.com/decalage2/oletools/wiki/olevba)