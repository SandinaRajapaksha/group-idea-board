# UCSC Vibe Coding – Testing

## Role Log

#### Subgroup 01

| Role     | Temporary Numbers |
| -------- | ----------------- |
| Typist    | `25001160`        |
| Prompter | `25001187`        |
| Tester       | `25001060`        |

#### Subgroup 02

| Role     | Temporary Numbers      |
| -------- | ---------------------- |
| Typist    | `25002084`        |
| Prompter | `25001112`, `25002112`        |
| Tester       | `25001164`        |

#### Subgrouop 03

| Role     | Temporary Numbers |
| -------- | ----------------- |
| Typist    | `25002085`        |
| Prompter | `25002080`        |
| Tester       | `25001059`        |

---

## Crash Report

#### Test 01 (Empty Input)

*Expectation*: Reject ideas without content or contributor, with responsive error messages.
*Result*: Responsive rejection(input shake animation) of empty ideas, or ideass with no contributor selected.  

#### Test 02 (Duplicate Ideas)

*Expectation*: Warn when duplicated ideas from the same contributor are added.
*Result*: Duplicate ideas are allowed with no warning or error.
*Fix*: "There should be a warning message when duplicate ideas are added to the idea board from the same contributor, but not rejected. #file:index.html"  

#### Test 03 (DuplicVery Long Ideas)

*Expectation*: Lengthier ideas should have a "Read More" button enabling it to be fully readable
*Result*: Lenghtier ideas get truncated into 4 lines.
*Fix*: "if the user has entered an idea with a very long text, the text gets trauncated into just 4 lines to keep up with the grid style, making the idea not fully visible. to fix this, make the idea cards clickable and once clicked, it should display the full idea within the same page on an overlay. Also add a Read More text as a visible indication"  

---

## The Fake API

``

---

## Extra tests

#### Test 01

---