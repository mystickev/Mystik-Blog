---
title: CPU Architecture and Assembly Refresher for Reverse Engineering
tag: Reverse Engineering
date: 2024-02-10
readTime: 15 min
excerpt: A comprehensive refresher on x64 assembly fundamentals covering registers, addressing modes, jump instructions, calling conventions, and stack mechanics for malware reverse engineering.
mitre: T1059 - Command and Scripting Interpreter, T1055 - Process Injection
---

An assembly language comprises constants, expressions, literals, reserved words, mnemonics, identifiers, directives, instructions, and comments.

## Radix Suffixes

- `-d` -- decimal
- `-h` -- hexadecimal
- `-q` or `-o` -- octal
- `-b` -- binary

Examples of integer constants:

- `26` -- decimal
- `1Ah` -- hexadecimal
- `1101b` -- binary
- `42Q` -- octal

## Directives

Commands for the assembler. They are case-insensitive.

```asm
.code

main PROC

  mov   eax, 10000h    ; Copies 10000h into EAX
  add   eax, 40000h    ; Adds 40000h to EAX
  sub   eax, 20000h    ; Subtracts 20000h from EAX
  call  DumpRegs        ; Call the procedure DumpRegs
  exit                  ; Call Windows Exit to halt the program

main ENDP               ; marks the end of main
end  main               ; last line to be assembled
```

```asm
.data
  val1  db  255   ; unsigned byte
```

`db` is the directive for assigning 8-bit data to a storage area.

## Addressing Modes

### Register Addressing Mode

Using the value directly from a register. If you have `MOV AX, BX` it means copy the value from the `BX` register to the `AX` register.

### Memory Addressing Mode

Using a value stored somewhere in RAM.

- **Direct Memory Addressing** -- you give an exact location: `MOV AX, [1234h]` means go to memory location `1234h` and get the value for `AX`
- **Indirect Memory Addressing** -- you give a formula to find the location

### Immediate Addressing Mode

Using a value directly in the instruction. `MOV AX, 5` means put the number 5 into the `AX` register.

### Implicit Addressing Mode

The instruction already knows where to get the value without being told explicitly.

- **SCASB** -- automatically uses the `AL` register to compare with a value in memory at the location pointed to by `EDI`
- **PUSH / POP** -- automatically use `ESP` to decide where to place or take values

## x64 General Purpose Registers

### RAX (EAX in x86)

Originally designed for arithmetic operations. In x64 it is general-purpose but frequently used to store the return value of a function. `EAX` refers to the lower 32 bits.

### RCX (ECX in x86)

Historically used as a loop counter. In x64 still often used in loops and string operations. `ECX` refers to the lower 32 bits.

### RBP (EBP in x86)

Known as the Base Pointer. In x86 used to point to the base of the current stack frame. In x64 its traditional role is reduced due to optimisations but can still reference local variables and function arguments. `EBP` refers to the lower 32 bits.

### RSP (ESP in x86)

The Stack Pointer -- always points to the top of the current stack. Critical for function call management and local variable storage. `ESP` refers to the lower 32 bits.

### RSI / RDI (ESI / EDI in x86)

Historically used for string and memory operations. `RSI` pointed to the source and `RDI` to the destination. In x64 still frequently used in string and memory operations but also serve as general-purpose registers.

## Segment Registers

- **CS (Code Segment)** -- where your actual code lives
- **DS (Data Segment)** -- the default storage area for most data operations
- **ES (Extra Segment)** -- an additional segment to aid with data operations
- **FS & GS** -- more extra segments introduced for specialised tasks
- **SS (Stack Segment)** -- where the stack lives

## Pointer and Index Registers

- **RIP (Instruction Pointer)** -- always points to the next instruction to be executed
- **RSI & RDI** -- specialised tools for string operations

## Floating Point Unit (FPU) Registers

- **ST0 to ST7** -- a stack of registers for decimal number calculations

## MMX Registers

Specialised registers for multimedia tasks such as image or video processing.

- **MM0 to MM7**

## XMM Registers

Used for SIMD (Single Instruction, Multiple Data) operations -- processing many similar tasks simultaneously.

- **XMM0 to XMM15**

## Control Registers

The control centre of the CPU.

- **CR0 to CR4, CR8** -- influence how the CPU operates

## Debug Registers

Used to monitor or troubleshoot code execution.

- **DR0 to DR7** -- notify you when specific memory locations are accessed, useful for catching bugs

## Memory Addressing -- Key Concepts

A single operand to a `PUSH` instruction is often a pointer. A pointer is a value that holds an address, and that address points to data stored at that location.

```asm
PUSH offset loc_46780  ; char softwareKey -- points to a reg key stored at this address
```

Consider `mov eax, [0x410230]`:

- The square brackets `[]` mean fetch the **data at** that address -- not the address itself. This is called **dereferencing**
- Specifying a direct address inside brackets is called **direct addressing**
- The result is that the 4 bytes at `0x410230` are moved into `EAX`

## Indirect Memory Addressing Examples

- **`[EAX]`** -- access the memory location that `EAX` points to
- **`[EBP + 0x10]`** -- start at `EBP` and move 16 bytes further into memory
- **`[EAX + EBX * 8]`** -- `EAX` is the base, each structure is 8 bytes apart, `EBX` selects which one
- **`[EAX + EBX + 0xC]`** -- combine base, offset register, and a fixed displacement

## Jump Instructions

### Unconditional Jumps

Always redirect execution to a new location with no conditions.

- **`JMP`** -- jump to a new address unconditionally
- **`CALL`** -- jump to a new location and save the return address
- **`RET`** -- return to the saved address after a `CALL`

### Conditional Jumps

Direct the CPU to shift execution based on the state of the flags register, which is updated after arithmetic or boolean operations.

**CMP and TEST:**

- **`CMP`** -- behaves like `SUB` but does not change the destination value, only updates flags
- **`TEST`** -- behaves like `AND` but does not alter the destination

**Jump Conditions (Jcc):**

- **A** -- above (unsigned)
- **B** -- below (unsigned)
- **E / Z** -- equal / zero
- **G** -- greater than (signed)
- **L** -- less than (signed)
- **N** -- not condition, e.g. `JNZ` means jump if not zero

**Flag evaluation examples:**

- `JB` (jump if below) -- true if the Carry flag is set
- `JG` (jump if greater) -- true if Zero flag is unset and Sign flag equals Overflow flag

## Common Instructions

Consider `0x20` stored at address `0x00830048` and `EBX` pointing to `0x00830040`:

```asm
lea eax, [ebx + 8]   ; moves the ADDRESS 0x00830048 into EAX
mov eax, [ebx + 8]   ; moves the CONTENTS at ebx+8 (0x20) into EAX
```

Increment and decrement:

```asm
inc  edx   ; increment EDX by 1
dec  ecx   ; decrement ECX by 1
```

Multiplication and division operate on predefined registers:

```asm
mul  value   ; multiplies EAX by value -- result stored across EDX:EAX
div  value   ; divides EDX:EAX by value -- result in EAX, remainder in EDX
```

## Reversing Functions

### Calling a Function

Function format: `return = function(arg0, arg1)`

Events when calling a function:
1. Pass in parameters via stack or register
2. Save return pointer
3. Transfer control to the function

Events when returning from a function:
1. Set up return value (typically `EAX`)
2. Clean up stack and restore registers
3. Transfer control to the saved return pointer

### Function Prologue

```asm
push  ebp          ; save EBP
mov   ebp, esp     ; create function stack frame
sub   esp, 104h    ; create space for local variables
push  edi          ; save registers used within the function
push  esi
```

### Function Epilogue

```asm
pop   esi
pop   edi
leave              ; mov esp, ebp; pop ebp
retn               ; pop eip -- return to saved address
```

## The Stack

The stack is **Last In, First Out (LIFO)**.

- `PUSH` adds an element, `POP` removes one
- `ESP` points to the top of the stack and changes with `PUSH`, `POP`, `CALL`, `LEAVE`, and `RET`
- `EBP` (frame pointer) is an unchanging reference point within the function
- `EBP - value` = local variable

![Stack memory layout](/images/stack-image.png)

### Typical Function Example

![Typical assembly function example](/images/typical-example.png)

### Corresponding Stack for the Function Above

![Stack layout for the function above](/images/stack-image-for-function.png)

### Stack Cleanup Actions

```asm
pop   edx          ; implies ESP + 4

retn               ; pop eip
leave              ; mov esp, ebp; pop ebp
add   esp, value   ; restore ESP state
```

## Calling Conventions

### cdecl (most common)

- Arguments placed on the stack right to left
- Return value placed in `EAX`
- **Caller** cleans up the stack

```asm
push  edx          ; SubStr
push  eax          ; Str
call  strstr
add   esp, 8       ; caller cleans up
```

### stdcall

- Same as cdecl but the **callee** cleans up the stack
- Convention used by Win32 APIs

```asm
push  offset LibFileName   ; "Kernel32.dll"
call  ds:LoadLibraryA
mov   [ebp+hModule], eax   ; no stack cleanup after call
```

### fastcall

- First two arguments passed in `ECX` and `EDX`
- Extra arguments placed on the stack
- **Callee** cleans up stack arguments

```asm
mov   edx, offset aCmdExe  ; "cmd.exe"
lea   ecx, [ebp+8]
call  sub_409008            ; note use of ECX and EDX
```

### thiscall

- Used in C++ member functions
- Includes a reference to the `this` pointer
- In Microsoft compilers, `ECX` holds the `this` pointer and the callee cleans up
- In GNU compilers, `this` is pushed onto the stack last and the caller cleans up

```asm
mov   ecx, eax             ; ECX holds the address of self
call  sub_10001067
```