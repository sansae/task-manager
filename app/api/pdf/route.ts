import { chromium } from "playwright";

export async function GET(request: Request) {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();

    // request.url is the full path; next provides us this...
    const url = new URL("/?print=true", request.url);

    // make url dynamic
    await page.goto(url.toString());
    await page.waitForLoadState("networkidle");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="tasks.pdf"'
      }
    });
  } catch (err) {
    console.error(err);
  } 
  
  // finally {
  //   await browser?.close();
  // }
}