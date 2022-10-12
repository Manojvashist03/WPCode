<?php
add_shortcode('custom_login', function () {
    if (is_user_logged_in()) {
        wp_redirect('/grades');
    } else {
        ob_start();
        global $errors;
        $errors = new WP_Error;
        if (($_POST['user_login'])) {
            $email = ($_POST["user_email"]);
            $password = ($_POST["user_password"]);
            if (empty($email) || empty($password)) {
                if (empty($email)) {
                    $errors->add('email', 'Field is required');
                }
                if (empty($password)) {
                    $errors->add('password', 'Field is required');
                }
            } elseif (!is_email($email)) {
                $errors->add('email', 'Field must be an email.');
            }

            if (!$errors->has_errors()) {
                $login_details = array('user_login' => $email,
                    'user_password' => $password
                );
                $user_login = wp_signon($login_details);
                if (is_wp_error($user_login)) {
                    $errors->add('login-error', 'Username or password are incorrect');
                } else {
                    wp_redirect('/grades');
                }
            }
        }
        ?>
        <form action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" method="post"
              name="user_login" class="login-form">

            <?php
            session_start();
            if (isset($_SESSION['success_message'])) {
                echo '<p class="alert alert-success">' . $_SESSION['success_message'] . '</p>';
                unset($_SESSION['success_message']);
            }
            if ($errors->get_error_message('login-error')) {
                echo '<p class="error-message">' . $errors->get_error_message('login-error') . '</p>';
            }
            ?>

            <div class="form-group">
                <input type="email" id="user_email" name="user_email" maxlength="80" class="form-control"
                       value="<?php echo(isset($_POST['user_email']) ? $_POST['user_email'] : null); ?>"
                       placeholder="Email"/>
                <?php
                if ($errors->get_error_message('email')) {
                    echo '<p class="error-message">' . $errors->get_error_message('email') . '</p>';
                }
                ?>
            </div>

            <div class="form-group">
                <input type="password" id="password" name="user_password" maxlength="30" class="form-control"
                       value="<?php echo(isset($_POST['user_password']) ? $_POST['user_password'] : null); ?>"
                       placeholder="Password"/>
                <?php
                if ($errors->get_error_message('password')) {
                    echo '<p class="error-message">' . $errors->get_error_message('password') . '</p>';
                }
                ?>
            </div>

            <div class="register-submit form-group">
                <input type="submit" name="user_login" class="form-control text-center btn btn-green"
                       value="Login"/>
            </div>

            <div>
                <span class="float-left"><a
                            href="/reset-password">Forgot Password?</a></span>
                <span class="float-right">No account yet? <a href="/terms-and-condition">Try it Free</a></span>
            </div>

        </form>
        <?php
    }
    return ob_get_clean();
});
