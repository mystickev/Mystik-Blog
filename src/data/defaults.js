// -- Default seed data -----------------------------------------------------
// POSTS are now loaded from .md files in src/posts/
// Resources and About are still managed via admin dashboard + localStorage
// To add a new post: create a .md file in src/posts/ with frontmatter, commit and push.

// -- Browser-safe frontmatter parser --------------------------------------
// Replaces gray-matter which uses Node.js Buffer -- not available in browser.
// Parses the --- block at the top of .md files into a data object + content.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const data = {}
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':')
    if (colon === -1) return
    const key = line.slice(0, colon).trim()
    const value = line.slice(colon + 1).trim()
    data[key] = value
  })

  return { data, content: match[2].trim() }
}

// -- Load all .md files from src/posts/ at build time ---------------------
// Vite resolves these at build time -- no runtime file system access needed.
// Each .md file must have frontmatter at the top (see example below).
//
// Example frontmatter:
// ---
// title: My Post Title
// tag: Forensics
// date: 2025-06-01
// readTime: 8 min
// excerpt: Short description shown in post list.
// mitre: T1040 - Network Sniffing, T1055 - Process Injection
// ---
//
// Content goes here in Markdown...

const mdFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })

export const POSTS = Object.entries(mdFiles)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)
    const slug = path.split('/').pop().replace('.md', '')
    return {
      id: slug,
      title: data.title || 'Untitled',
      tag: data.tag || 'Uncategorized',
      date: data.date ? String(data.date) : new Date().toISOString().split('T')[0],
      readTime: data.readTime || '5 min',
      mitre: data.mitre
        ? String(data.mitre).split(',').map(s => s.trim()).filter(Boolean)
        : [],
      excerpt: data.excerpt || '',
      content: content || '',
    }
  })
  .sort((a, b) => new Date(b.date) - new Date(a.date))

// -- Fallback seed posts ---------------------------------------------------
// Shown only if no .md files exist in src/posts/ yet.
// Once you add real .md files, these are ignored.
export const DEFAULT_POSTS = POSTS.length > 0 ? POSTS : [
  {
    id: 'dll-injection',
    title: "Process Injection via Classic DLL Injection: Detection & Analysis",
    excerpt: "A technical breakdown of how DLL injection works at the Windows API level, what artefacts it leaves in memory, and how to build a reliable Wazuh detection rule to catch it.",
    tag: "Reverse Engineering",
    date: "2025-05-18",
    readTime: "12 min",
    mitre: ["T1055.001 - Process Injection: DLL Injection"],
    content: `## Overview\n\nProcess injection remains one of the most abused techniques in the malware ecosystem. It allows adversaries to execute arbitrary code within the address space of a legitimate process -- evading process-based detections and inheriting the process's privileges.\n\n## How Classic DLL Injection Works\n\nThe technique follows four primitive Windows API calls in sequence:\n\n1. **OpenProcess** -- acquire a handle to the target process\n2. **VirtualAllocEx** -- allocate memory within the remote process\n3. **WriteProcessMemory** -- write the DLL path into allocated memory\n4. **CreateRemoteThread** -- spawn a thread pointing to LoadLibraryA\n\n## Detection\n\nFrom a telemetry perspective, classic DLL injection generates several observable artefacts including cross-process memory allocation and CreateRemoteThread calls where the start address resolves to LoadLibraryA.\n\n## MITRE\n\nT1055.001, T1106, T1562.001`
  },
  {
    id: 'certutil-lolbin',
    title: "LOLBin Hunting: certutil.exe Abuse for Payload Delivery",
    excerpt: "certutil.exe is one of the most reliable dual-use binaries for adversaries. Detection strategies that don't drown in noise.",
    tag: "LOLBins",
    date: "2025-04-30",
    readTime: "9 min",
    mitre: ["T1218 - System Binary Proxy Execution", "T1105 - Ingress Tool Transfer"],
    content: `## Overview\n\nLOLBins -- Living-off-the-Land Binaries -- are signed, trusted Windows binaries repurposed for malicious activity. **certutil.exe** ships with every Windows installation and can decode Base64, download files, and encode data.\n\n## Common Abuse Patterns\n\n- Remote file download via \`-urlcache -split -f\`\n- Base64 decode via \`-decode\`\n- Renamed binary to evade process-name detections\n\n## Detection Logic\n\nHunt on **OriginalFileName** metadata, not the process name. Sysmon Event ID 1 exposes this field -- if OriginalFileName is CertUtil.exe but the Image path is anything other than System32, that's your signal.\n\n## MITRE\n\nT1218, T1105, T1140, T1036.003`
  }
]

// -- Resources default data ------------------------------------------------
// Managed via Admin Dashboard -> Resources. Saved to localStorage.
// This is the fallback shown on first load before any admin edits.
export const DEFAULT_RESOURCES = [
  { id: 1,  name: "Ghidra",          desc: "NSA's open-source reverse engineering framework. Primary disassembler for static analysis.",          url: "https://ghidra-sre.org",                       icon: "?", category: "Reversing & Analysis"    },
  { id: 2,  name: "x64dbg",          desc: "Open-source debugger for dynamic analysis on x64/x32 Windows binaries.",                             url: "https://x64dbg.com",                           icon: "?", category: "Reversing & Analysis"    },
  { id: 3,  name: "ANY.RUN",         desc: "Interactive malware sandbox for quick behavioural analysis and IOC extraction.",                      url: "https://any.run",                              icon: "?", category: "Reversing & Analysis"    },
  { id: 4,  name: "MITRE ATT&CK",    desc: "The adversary behaviour knowledge base. Every detection maps back here.",                             url: "https://attack.mitre.org",                     icon: "?", category: "Threat Intelligence"      },
  { id: 5,  name: "MalwareBazaar",   desc: "Abuse.ch malware sample repository with YARA matching.",                                             url: "https://bazaar.abuse.ch",                      icon: "?", category: "Threat Intelligence"      },
  { id: 6,  name: "AlienVault OTX",  desc: "Open threat exchange platform with community-sourced IOC pulses.",                                   url: "https://otx.alienvault.com",                   icon: "?", category: "Threat Intelligence"      },
  { id: 7,  name: "Sigma",           desc: "Generic SIEM rule format. Write once, translate to Kibana, Splunk, Wazuh and more.",                 url: "https://github.com/SigmaHQ/sigma",             icon: "S",  category: "Detection Engineering"   },
  { id: 8,  name: "Atomic Red Team", desc: "Test library for validating detections against real MITRE ATT&CK techniques.",                       url: "https://github.com/redcanaryco/atomic-red-team",icon: "?", category: "Detection Engineering"   },
  { id: 9,  name: "MalDev Academy",  desc: "Structured malware development curriculum in C/C++ -- understand implants from the inside.",          url: "https://maldevacademy.com",                    icon: "?", category: "Learning & Reference"     },
  { id: 10, name: "LOLBAS Project",  desc: "Living-off-the-Land Binaries, Scripts and Libraries catalogue for detection coverage.",              url: "https://lolbas-project.github.io",             icon: "?", category: "Learning & Reference"     },
  { id: 11, name: "The DFIR Report", desc: "Detailed real-world intrusion write-ups. Best source of adversary TTPs.",                            url: "https://thedfirreport.com",                    icon: "?", category: "Learning & Reference"     },
]

// -- About default data ----------------------------------------------------
// Managed via Admin Dashboard -> About. Saved to localStorage.
export const DEFAULT_ABOUT = {
  tagline: "Dissecting the adversary's craft.",
  bio: "I'm Mystik -- a threat hunter and malware analyst leading a Threat Vulnerability Management team within a SOC environment. I work across Linux and Windows endpoints, building detections, hunting adversaries, and doing the occasional deep dive into malware that's doing its best to stay hidden.\n\nDay-to-day, I live in Wazuh, Kibana, and Cynet EDR. Beyond the tooling, I'm invested in understanding the why behind tradecraft -- from how adversaries abuse LOLBins to how implants achieve persistence and evade behavioural detection.\n\nThis blog is my public lab notebook. Everything here is mapped to MITRE ATT&CK where applicable.",
  skills: "Malware Reverse Engineering, Threat Hunting, Wazuh Detection Rules, MITRE ATT&CK, LOLBin Analysis, Incident Response, Malware Development, Windows Internals, Lateral Movement Analysis, Threat Intelligence, EDR Telemetry, C2 Detection",
  tools: "Wazuh · Kibana · Cynet EDR · Ghidra · x64dbg · YARA · CrackMapExec · Nessus · Atomic Red Team · Volatility · Wireshark · Python · C/C++",
  certs: "Threat Hunting Practitioner, SOC Analyst L2, Wazuh Detection Engineering, MITRE ATT&CK Fundamentals",
  openTo: "CTF collaborations, threat intel sharing, and peer review of malware write-ups."
}

// -- Tag configuration -----------------------------------------------------
// Add new tags here -- they appear in the admin post editor dropdown
// and the filter bar on the blog page.
// Also add a matching entry in TAG_STYLES for colour -- defaults to grey if missing.
export const ALL_TAGS = [
  "Reverse Engineering",
  "CTF",
  "Incident Response",
  "Threat Hunting",
  "Threat Intel",
  "Malware Development",
  "Forensics",
  "Malware Analysis",
]

export const TAG_STYLES = {
  "Reverse Engineering": { color: "#5ef5b8", bg: "rgba(94,245,184,0.12)"  },
  "CTF":                 { color: "#f5c842", bg: "rgba(245,200,66,0.12)"  },
  "Incident Response":   { color: "#f0604a", bg: "rgba(240,96,74,0.12)"   },
  "Threat Hunting":      { color: "#60d5f5", bg: "rgba(96,213,245,0.12)"  },
  "Threat Intel":        { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  "Malware Development": { color: "#f5904a", bg: "rgba(245,144,74,0.12)"  },
  "Forensics":           { color: "#c8956c", bg: "rgba(200,149,108,0.12)" },
  "Malware Analysis":    { color: "#a855f7", bg: "rgba(168,85,247,0.12)"  },
}