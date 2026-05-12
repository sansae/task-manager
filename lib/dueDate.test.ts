import { formatDueDateLabel, isDueOverdue } from "./dueDate"

describe("isDueOverdue", () => {
  it("returns false for completed tasks", () => {
    expect(isDueOverdue("2026-01-01", true)).toBe(false)
  })
})

describe("formatDueDateLabel", () => {
  it("returns \"Today\" for a task with current day as date", () => {
    expect(formatDueDateLabel("2026-05-12")).toBe("Today")
  })

  it("returns \"Tomorrow\" for a task with tomorrow as date", () => {
    expect(formatDueDateLabel("2026-05-13")).toBe("Tomorrow")
  })

  it("return \"In x days (mm/dd/yy)\"", () => {
    expect(formatDueDateLabel("2026-05-16")).toBe("In 4 days (5/15/2026)")
  })

  it("return \"Yesterday\" for a task with yesterday's date", () => {
    expect(formatDueDateLabel("2026-05-11")).toBe("Yesterday")
  })

  it("return \"x days ago\"", () => {
    expect(formatDueDateLabel("2026-05-06")).toBe("6 days ago")
  })
})