import type { BrowserContext } from 'playwright'

// Human-like random delay between min and max ms
function delay(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs) + minMs)
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Human-like typing: types one character at a time with random pauses
async function humanType(page: import('playwright').Page, selector: string, text: string) {
  await page.click(selector)
  for (const char of text) {
    await page.keyboard.type(char)
    await delay(40, 120)
  }
}

export async function sendConnectionRequest(
  context: BrowserContext,
  linkedinUrl: string,
  note?: string
): Promise<void> {
  const page = await context.newPage()

  try {
    await page.goto(linkedinUrl, { waitUntil: 'domcontentloaded', timeout: 20_000 })
    await delay(1500, 3000)

    // Look for the Connect button on the profile
    const connectBtn = page.locator('button:has-text("Connect")').first()
    const isVisible = await connectBtn.isVisible({ timeout: 5_000 }).catch(() => false)

    if (!isVisible) {
      // Already connected or "Follow" profile — check for "More" dropdown
      const moreBtn = page.locator('button:has-text("More")').first()
      const moreVisible = await moreBtn.isVisible({ timeout: 3_000 }).catch(() => false)
      if (moreVisible) {
        await moreBtn.click()
        await delay(500, 1000)
        const connectInMenu = page.locator('[aria-label*="Connect"]').first()
        await connectInMenu.click({ timeout: 3_000 })
      } else {
        throw new Error('Connect button not found — already connected or profile not reachable')
      }
    } else {
      await connectBtn.click()
    }

    await delay(800, 1500)

    if (note) {
      // Click "Add a note" if available
      const addNoteBtn = page.locator('button:has-text("Add a note")').first()
      const noteVisible = await addNoteBtn.isVisible({ timeout: 3_000 }).catch(() => false)
      if (noteVisible) {
        await addNoteBtn.click()
        await delay(500, 1000)
        await humanType(page, 'textarea[name="message"]', note)
        await delay(500, 1200)
      }
    }

    // Click Send / Connect
    const sendBtn = page.locator('button:has-text("Send"), button:has-text("Send now")').first()
    await sendBtn.click({ timeout: 5_000 })
    await delay(1000, 2000)

  } finally {
    await page.close()
  }
}

export async function sendLinkedInMessage(
  context: BrowserContext,
  linkedinProfileId: string,
  message: string
): Promise<void> {
  const page = await context.newPage()

  try {
    // Use the messaging URL directly for existing connections
    const messageUrl = `https://www.linkedin.com/messaging/thread/new/?recipients=${linkedinProfileId}`
    await page.goto(messageUrl, { waitUntil: 'domcontentloaded', timeout: 20_000 })
    await delay(2000, 3500)

    // Find the message input
    const input = page.locator('.msg-form__contenteditable, [data-placeholder*="Write a message"]').first()
    const inputVisible = await input.isVisible({ timeout: 8_000 }).catch(() => false)

    if (!inputVisible) {
      // Fallback: navigate to profile and click Message button
      await page.goto(`https://www.linkedin.com/in/${linkedinProfileId}/`, { waitUntil: 'domcontentloaded', timeout: 20_000 })
      await delay(1500, 2500)
      const msgBtn = page.locator('button:has-text("Message")').first()
      await msgBtn.click({ timeout: 5_000 })
      await delay(1000, 2000)
    }

    const msgInput = page.locator('.msg-form__contenteditable, [data-placeholder*="Write a message"]').first()
    await msgInput.click()
    await delay(300, 700)

    // Type message in chunks to appear human
    const chunks = message.match(/.{1,20}/g) ?? [message]
    for (const chunk of chunks) {
      await page.keyboard.type(chunk)
      await delay(80, 200)
    }

    await delay(800, 1500)

    // Send with Enter or Send button
    const sendBtn = page.locator('.msg-form__send-button, button[type="submit"]:has-text("Send")').first()
    const sendVisible = await sendBtn.isVisible({ timeout: 3_000 }).catch(() => false)
    if (sendVisible) {
      await sendBtn.click()
    } else {
      await page.keyboard.press('Enter')
    }

    await delay(1000, 2000)
  } finally {
    await page.close()
  }
}

// Follow-up is the same as message — just a different step context
export const sendFollowUp = sendLinkedInMessage
