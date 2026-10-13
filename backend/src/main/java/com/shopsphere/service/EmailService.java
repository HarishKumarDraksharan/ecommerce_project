package com.shopsphere.service;

import com.shopsphere.entity.Order;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * EmailService – sends transactional emails via JavaMailSender + Thymeleaf.
 * All email methods are @Async to avoid blocking request threads.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.email-from:noreply@shopsphere.com}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.name:ShopSphere}")
    private String appName;

    // ── Verification Email ───────────────────────────────────

    @Async
    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        try {
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("verificationUrl",
                    frontendUrl + "/verify-email?token=" + token);
            context.setVariable("appName", appName);

            String html = templateEngine.process("email/verification", context);
            sendHtmlEmail(toEmail, appName + " – Verify Your Email", html);
            log.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ── Password Reset Email ──────────────────────────────────

    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        try {
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("resetUrl",
                    frontendUrl + "/reset-password?token=" + token);
            context.setVariable("appName", appName);

            String html = templateEngine.process("email/password-reset", context);
            sendHtmlEmail(toEmail, appName + " – Reset Your Password", html);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    // ── Order Confirmation Email ──────────────────────────────

    @Async
    public void sendOrderConfirmationEmail(String toEmail, String firstName, Order order) {
        try {
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("order", order);
            context.setVariable("trackingUrl",
                    frontendUrl + "/orders/" + order.getOrderNumber());
            context.setVariable("appName", appName);

            String html = templateEngine.process("email/order-confirmation", context);
            sendHtmlEmail(toEmail, appName + " – Order Confirmed: " + order.getOrderNumber(), html);
            log.info("Order confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    // ── Order Shipped Email ───────────────────────────────────

    @Async
    public void sendOrderShippedEmail(String toEmail, String firstName, Order order) {
        try {
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("order", order);
            context.setVariable("trackingNumber", order.getTrackingNumber());
            context.setVariable("appName", appName);

            String html = templateEngine.process("email/order-shipped", context);
            sendHtmlEmail(toEmail, appName + " – Your Order Has Been Shipped!", html);
        } catch (Exception e) {
            log.error("Failed to send order shipped email: {}", e.getMessage());
        }
    }

    // ── Generic Send ─────────────────────────────────────────

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
