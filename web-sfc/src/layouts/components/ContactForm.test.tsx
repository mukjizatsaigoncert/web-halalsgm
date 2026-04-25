import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

jest.mock("@/lib/strapi/api/contact", () => ({
  submitContact: jest.fn(),
}));

import { submitContact } from "@/lib/strapi/api/contact";

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/Họ và Tên/i), "Nguyen A");
  await user.type(screen.getByLabelText(/Email/i), "a@example.com");
  await user.type(screen.getByLabelText(/Số điện thoại/i), "0901234567");
  await user.type(screen.getByLabelText(/Chủ đề/i), "Test subject");
  await user.type(screen.getByLabelText(/Nội dung/i), "Test message body");
};

describe("<ContactForm />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title and description", () => {
    render(<ContactForm title="Liên hệ" description="Mô tả" />);
    expect(screen.getByText("Liên hệ")).toBeInTheDocument();
    expect(screen.getByText("Mô tả")).toBeInTheDocument();
  });

  it("calls submitContact with form data + recaptcha token on submit", async () => {
    (submitContact as jest.Mock).mockResolvedValue({ data: { id: 1 } });
    const user = userEvent.setup();
    render(<ContactForm title="T" description="D" />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: /Gửi Tin Nhắn/i }));

    await waitFor(() => {
      expect(submitContact).toHaveBeenCalledTimes(1);
    });
    const [payload, token] = (submitContact as jest.Mock).mock.calls[0];
    expect(payload.email).toBe("a@example.com");
    expect(token).toBe("test-recaptcha-token");
  });

  it("shows success message after a successful submission", async () => {
    (submitContact as jest.Mock).mockResolvedValue({ data: { id: 1 } });
    const user = userEvent.setup();
    render(<ContactForm title="T" description="D" />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: /Gửi Tin Nhắn/i }));

    expect(await screen.findByText(/Cảm ơn bạn đã liên hệ/i)).toBeInTheDocument();
  });

  it("shows error message when Strapi returns an error", async () => {
    (submitContact as jest.Mock).mockResolvedValue({
      data: null,
      error: { status: 403, name: "Forbidden", message: "captcha failed" },
    });
    const user = userEvent.setup();
    render(<ContactForm title="T" description="D" />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: /Gửi Tin Nhắn/i }));

    expect(await screen.findByText(/captcha failed/i)).toBeInTheDocument();
  });
});
