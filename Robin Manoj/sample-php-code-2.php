<?php
session_start();
add_shortcode('custom_registration', function () {
    if (is_user_logged_in() && !current_user_can('administrator')) {
        wp_redirect(home_url());
    } else {
        ob_start();

        global $errors;
        $errors = new WP_Error;
        if (($_POST)) {
            $name = ($_POST["full_name"]);
            $email = ($_POST["user_email"]);
            $password = ($_POST["user_password"]);
            $role = ($_POST["profile_type"]);
            if (empty($name) || empty($email) || empty($password) || empty($role)) {
                if (empty($name)) {
                    $errors->add('name', 'Field is required');
                }
                if (empty($email)) {
                    $errors->add('email', 'Field is required');
                }
                if (empty($password)) {
                    $errors->add('password', 'Field is required');
                }
                if (empty($role)) {
                    $errors->add('role', 'Field is required');
                }
            }
            if (!is_email($email)) {
                $errors->add('email', 'Field must be an email.');
            }
            if (email_exists($email)) {
                $errors->add('email', 'Email already exists');
            }
            if (!$errors->has_errors()) {
                $userdata = array(
                    'user_login' => $email,
                    'user_email' => $email,
                    'user_pass' => $password
                );
                if ($role === 'group_leader')
                    $usermeta = array(
                        'first_name' => $name,
                        'total_grades_access' => null,
                        'total_students_access' => null,
                        'mentor' => 0,
                    );
                else {
                    $usermeta = array(
                        'first_name' => $name,
                        'total_grades_access' => null,
                        'mentor' => 2,
                        'enrolled' => 1
                    );
                }


                $register_user = wp_insert_user($userdata);
                if (!is_wp_error($register_user)) {
                    //update user meta with custom fields
                    foreach ($usermeta as $key => $meta) {
                        update_user_meta($register_user, $key, $meta);
                    }
                    $user_data = new WP_User($register_user);
                    $user_data->remove_role('subscriber');
                    $user_data->add_role($role);
                    $_SESSION['success_message'] = 'You are successfully registered!';
                    registration_email($user_data,$role);
                    wp_redirect('/login');
                }
            }
        }
        ?>
        <form action="<?php echo esc_url($_SERVER['REQUEST_URI']); ?>" method="post"
              name="user_registeration" class="registration-form">
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

            <label>Select who you are</label>
            <div class="row">
                <div class="col-md-6 form-group">
                    <input class="form-check-input" type="radio" name="profile_type" id="profile_type1"
                           value="subscriber">
                    <label class="form-check-label" for="profile_type1">
                        Student
                    </label>
                </div>
                <div class="col-md-6 form-group">
                    <input class="form-check-input" type="radio" name="profile_type" id="profile_type2"
                           value="group_leader">
                    <label class="form-check-label" for="profile_type2">
                        Mentor/ Teacher/ Parent
                    </label>
                </div>
                <?php
                if ($errors->get_error_message('role')) {
                    echo '<p class="error-message">' . $errors->get_error_message('role') . '</p>';
                }
                ?>
            </div>

            <div class="form-group">
                <input type="text" id="first-name" class="form-control"
                       value="<?php echo(isset($_POST['full_name']) ? $_POST['full_name'] : null); ?>"
                       name="full_name" maxlength="50"
                       placeholder="Name"/>
                <?php
                if ($errors->get_error_message('name')) {
                    echo '<p class="error-message">' . $errors->get_error_message('name') . '</p>';
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

            <div class="register-submit form-group mb-5">
                <input type="submit" class="form-control text-center btn btn-green submit-btn"
                       value="Sign up for free"/>
            </div>
        </form>
        <?php
    }
    return ob_get_clean();
});
