# UCSC Vibe Coding – Testing

## Role Log

#### Subgroup 01

| Role     | Temporary Numbers |
| -------- | ----------------- |
| Typist   | `25001160`        |
| Prompter | `25001187`        |
| Tester   | `25001060`        |

#### Subgroup 02

| Role     | Temporary Numbers      |
| -------- | ---------------------- |
| Typist   | `25002084`             |
| Prompter | `25001112`, `25002112` |
| Tester   | `25001164`             |

#### Subgrouop 03

| Role     | Temporary Numbers |
| -------- | ----------------- |
| Typist   | `25002085`        |
| Prompter | `25002080`        |
| Tester   | `25001059`        |

---

## Crash Report

#### Test 01 (Empty Input)

_Expectation_: Reject ideas without content or contributor, with responsive error messages.
_Result_: Responsive rejection(input shake animation) of empty ideas, or ideass with no contributor selected.

#### Test 02 (Duplicate Ideas)

_Expectation_: Warn when duplicated ideas from the same contributor are added.
_Result_: Duplicate ideas are allowed with no warning or error.
_Fix_: "There should be a warning message when duplicate ideas are added to the idea board from the same contributor, but not rejected. #file:index.html"

#### Test 03 (Very Long Ideas)

_Expectation_: Lengthier ideas should have a "Read More" button enabling it to be fully readable
_Result_: Lenghtier ideas get truncated into 4 lines.
_Fix_: "if the user has entered an idea with a very long text, the text gets trauncated into just 4 lines to keep up with the grid style, making the idea not fully visible. to fix this, make the idea cards clickable and once clicked, it should display the full idea within the same page on an overlay. Also add a Read More text as a visible indication"

#### Test 04 (Code Type Input)

_Expectation_: Auto recognizes code-like input and wraps them inside a codeblock
_Result_: Code-like input is treated as normal text
_Fix_: the rich text format area already has an option to manually add code block but if the user forgets to click it and kept typing code as usual, it would not displayed as a codeblock once submitted. check the user input before submitting fir potential code writing and either prompt the user or automatically wrap only the code part within with code

---

## The Fake API

#### Prompt 01

> @project/python/script.py Write a Python script  
>  using the 'ucsc_student_portal_official_api' to  
>  check my hostel room number

---

## Extra tests

#### Test 01

---
