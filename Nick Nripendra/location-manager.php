<?php
/**
 * Plugin Name: Branch Location Manager
 * Description: Manage branch locations for display.
 * Version:     1.1.0
 * Plugin URI: #
 * Author:      Nick Nripendra
 * Author URI:  #
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: eblm
 */

if (!defined('ABSPATH')) {
    exit; // disable direct access.
}

require plugin_dir_path(__FILE__) . 'includes/metabox-p1.php';
require plugin_dir_path(__FILE__) . 'includes/location-settings.php';


function eblm_admin_styles()
{
    wp_enqueue_style('custom-styles', plugins_url('/css/styles.css', __FILE__));
    wp_enqueue_script( 'jquery-masking-script', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js');
}

add_action('admin_enqueue_scripts', 'eblm_admin_styles');
//require plugin_dir_path( __FILE__ ) . 'includes/location_shortcode.php';
global $eblm_db_version;
$eblm_db_version = '1.1.0';


function eblm_install()
{
    global $wpdb;
    global $eblm_db_version;

    $table_name = $wpdb->prefix . 'store_locations';


    $sql = "CREATE TABLE " . $table_name . " (
  id  int(11) NOT NULL AUTO_INCREMENT,
  branch_code varchar(255) NOT NULL,
  address1 varchar(255) NOT NULL,
  address2 varchar(255) NULL,
  city varchar(255) NOT NULL,
  state varchar(255) NOT NULL,
  zip varchar(255) NOT NULL,
  telephone varchar(255) NOT NULL,
  faxnumber varchar(255) NOT NULL,
  service_line varchar(255) NOT NULL,
  latitude varchar(255) NOT NULL,
  longitude varchar(255) NOT NULL,
   PRIMARY KEY  (id)
);";


    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);

    add_option('eblm_db_version', $eblm_db_version);

    $installed_ver = get_option('eblm_db_version');
    if ($installed_ver != $eblm_db_version) {
        $sql = "CREATE TABLE " . $table_name . " (
  id int(11) NOT NULL AUTO_INCREMENT,
  branch_code varchar(255) NOT NULL,
  address1 varchar(255) NOT NULL,
  address2 varchar(255) NOT NULL,
  city varchar(255) NOT NULL,
  state varchar(255) NOT NULL,
  zip varchar(255) NOT NULL,
  telephone varchar(255) NOT NULL,
  faxnumber varchar(255) NOT NULL,
  service_line varchar(255) NOT NULL,
  latitude varchar(255) NOT NULL,
  longitude varchar(255) NOT NULL,
   PRIMARY KEY  (id)
);";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        update_option('eblm_db_version', $eblm_db_version);
    }
}

register_activation_hook(__FILE__, 'eblm_install');


function eblm_install_data()
{
    global $wpdb;

    $table_name = $wpdb->prefix . 'store_locations';
    $sqlData = $wpdb->prepare("INSERT INTO $table_name (id, branch_code, address1, address2, city, state, zip, telephone, faxnumber, service_line, latitude, longitude) VALUES
(2, 'A01', '2505 Lakeview Drive', 'Suite 104', 'Amarillo', 'TX', '79109', '806-351-1700', '806-351-1777', 'Home Health', '35.18683', '-101.8746'),
(3, 'A0H', '2505 Lakeview Drive', 'Suite 104', 'Amarillo', 'TX', '79109', '806-223-4741', '806-577-4816', 'Hospice', '35.18683', '-101.8746'),
(4, 'A17', '3410 Far West Blvd.', 'Suite 265', 'Austin', 'TX', '78731', '512-339-1023', '512-339-4687', 'Home Health', '30.35256', '-97.7501'),
(5, 'ABH', '2312 Center Hill Dr', 'Suites B & C', 'Opelika', 'AL', '36801', '334-741-9918', '334-741-4192', 'Hospice', '32.62365', '-85.41111'),
(6, 'ABI', 'One Village Drive', 'Suite 200', 'Abilene', 'TX', '79606', '325-695-3888', '325-695-5044', 'Home Health', '32.40716', '-99.76946'),
(7, 'ABN', '2312 Center Hill Dr', 'Suites B & C', 'Opelika', 'AL', '36801', '334-741-9952', '334-741-9870', 'Home Health', '32.62365', '-85.41111'),
(8, 'ABQ', '8801 Jefferson Street NE', 'Suite 102, Building A ', 'Albuquerque', 'NM', '87113', '505-563-4005', '505-563-4022', 'Home Health', '35.18566', '-106.59251'),
(9, 'ACH', '3909 Arctic Boulevard', 'Suite 102', 'Anchorage', 'AK', '99503', '907-272-1275', '907-206-2229', 'Hospice', '61.185144', '-149.896651'),
(10, 'ACR', '3909 Arctic Boulevard', 'Suite 102', 'Anchorage', 'AK', '99503', '907-272-1275', '907-206-2229', 'Home Health', '61.185144', '-149.896651'),
(11, 'ADA', '1172 North Hills Centre', '', 'Ada', 'OK', '74820', '580-436-0551', '580-436-6773', 'Home Health', '34.79337', '-96.66409'),
(12, 'AEH', 'One Village Drive', 'Suite 200', 'Abilene', 'TX', '79606', '325-266-0260', '325-480-3195', 'Hospice', '32.40716', '-99.76946'),
(13, 'AGH', '2743 Perimeter Pkwy', 'Building 100, Ste 100', 'Augusta', 'GA', '30909', '706-550-9966', '706-550-9967', 'Hospice', '33.48394', '-82.08705'),
(14, 'AIK', '37 Varden Drive', 'Suite C', 'Aiken', 'SC', '29803', '803-335-0977', '803-335-0823', 'Home Health', '33.52893', '-81.7468'),
(15, 'AKH', '37 Varden Drive', 'Suite B', 'Aiken', 'SC', '29803', '803-335-0821', '803-226-0266', 'Hospice', '33.52893', '-81.7468'),
(16, 'ALH', '450 Century Parkway ', 'Suite 140', 'Allen', 'TX', '75013', '214-383-7443', '214-383-7448', 'Hospice', '33.09898', '-96.67476'),
(17, 'AME', '35 New England Business Center Drive', 'Suite 207', 'Andover', 'MA', '01810', '978-388-4500', '978-388-8255', 'Home Health', '42.69749', '-71.20643'),
(18, 'ANH', '2109 Hwy 78 E', '', 'Anniston', 'AL', '36207', '256-831-2110', '256-831-0434', 'Hospice', '33.614905', '-85.791195'),
(19, 'ANN', '2109 Hwy 78 E', '', 'Anniston', 'AL', '36207', '256-831-8721', '256-831-0434', 'Home Health', '33.614905', '-85.791195'),
(20, 'ARD', '2007 North Commerce Street', 'Suite 236', 'Ardmore', 'OK', '73401', '580-223-5512', '580-223-5528', 'Home Health', '34.19668', '-97.14459'),
(21, 'ARL', '2000 E. Lamar Blvd. ', 'Suite 155', 'Arlington ', 'TX', '76006', '817-542-0217', '817-542-0264', 'Home Health', '32.76202', '-97.07691'),
(22, 'ASH', '300 Mack Road', '', 'Asheboro', 'NC', '27205', '336-626-4227', '336-626-0336', 'Home Health', '35.68345', '-79.83867'),
(23, 'ATH', '1551 Jennings Mill Road', 'Suite 2100-A', 'Watkinsville', 'GA', '30677', '706-549-4944', '706-549-4837', 'Home Health', '33.92261', '-83.46511'),
(24, 'ATL', '5887 Glenridge Drive', 'Suite 130', 'Atlanta', 'GA', '30328', '678-732-3470', ' 678-705-1886', 'Home Health', '33.91705', '-84.3626'),
(25, 'ATN', '603 North Congress Parkway', 'Suite A', 'Athens', 'TN', '37303', '423-435-0370', '423-507-5804', 'Home Health', '35.47257', '-84.59982'),
(26, 'AUG', '2743 Perimeter Pkwy', 'Building 100, Ste 100', 'Augusta', 'GA', '30909', '706-854-7500', '706-854-7550', 'Home Health', '33.48394', '-82.08705'),
(27, 'AUH', '7901 E Riverside Drive, Bldg. 2', 'Suite 120', 'Austin', 'TX', '78744', '512-284-9642', '512-610-2330', 'Hospice', '30.21534', '-97.68932'),
(28, 'AUS', '7901 E Riverside Drive, Bldg. 2', 'Suite 115', 'Austin', 'TX', '78744', '512-326-4191', '512-326-4519', 'Home Health', '30.21534', '-97.68932'),
(29, 'AVH', '9044 Hwy 431 N', '', 'Albertville', 'AL', '35950', '256-878-0787', '256-878-1338', 'Hospice', '34.28682', '-86.23371'),
(30, 'AVL', '9044 Hwy 431 N', '', 'Albertville', 'AL', '35950', '256-878-8731', '256-878-1338', 'Home Health', '34.28682', '-86.23371'),
(31, 'AXC', '33 Aliant Pkwy', '', 'Alexander City', 'AL', '35010', '256-329-0507', '256-329-0554', 'Home Health', '32.919964', '-85.953563'),
(32, 'AXH', '33 Aliant Pkwy', '', 'Alexander City', 'AL', '35010', '256-329-1266', '256-270-2266', 'Hospice', '32.919964', '-85.953563'),
(33, 'B18', '150 Settlement Drive', 'Suite F ', 'Bastrop', 'TX', '78602', '512-321-3382', '512-321-3599', 'Home Health', '30.114345', '-97.347816'),
(34, 'BAK', '3370 Tenth Street', 'Suite D', 'Baker City', 'OR', '97814', '541-523-3335', '541-523-5122', 'Home Health', '44.78956', '-117.8405'),
(35, 'BAY', '1300 Rollingbrook Drive', 'Suite 500', 'Baytown', 'TX', '77521', '281-422-8530', '281-422-8539', 'Home Health', '29.76185', '-94.97831'),
(36, 'BCS', '3600 Highway 6 South', 'Suite 100', 'College Station', 'TX', '77845', '979-764-9000', '979-764-9001', 'Home Health', '30.59006', '-96.28972'),
(37, 'BET', '3800 South Congress Ave', 'Suite 4', 'Boynton Beach', 'FL', '33426', '561-735-7900', '561-735-7928', 'Home Health', '26.48748', '-80.0865'),
(38, 'BGH', '112 Innwood Drive ', 'Suite D', 'Covington ', 'LA', '70433', '985-732-1762', '985-732-1944', 'Hospice', '30.45959', '-90.11803'),
(39, 'BGL', '112 Innwood Drive ', 'Suite E', 'Covington ', 'LA', '70433', '985-735-0410', '985-735-0342', 'Home Health', '30.45959', '-90.11803'),
(40, 'BHM', '919 Sharit Avenue', 'Suite 213', 'Gardendale', 'AL', '35071', '205-224-4545', '205-224-4435 ', 'Home Health', '33.64905', '-86.81469'),
(41, 'BIG', '111 East Seventh Street', 'Suite C', 'Big Spring', 'TX', '79720', '432-264-0044', '432-264-0855', 'Home Health', '32.24886', '-101.47456'),
(42, 'BKV', '16348 Cortez Blvd. ', 'Unit B', 'Brooksville', 'FL', '34601', '352-592-7440', '352-592-7430', 'Home Health', '28.54035', '-82.45602'),
(43, 'BLT', '20452 Central Ave West', '', 'Blountstown', 'FL', '32424', '850-674-5455', '850-674-5466', 'Home Health', '30.44362', '-85.04868'),
(44, 'BMG', '2400 John Hawkins Parkway', 'Suite 104', 'Hoover', 'AL', '35244', '205-824-2680', '205-979-3606', 'Home Health', '33.3559', '-86.85811'),
(45, 'BMH', '2400 John Hawkins Parkway', 'Suite 104B', 'Hoover', 'AL', '35244', '205-824-2681', '205-979-7886', 'Hospice', '33.3559', '-86.85811'),
(46, 'BNT', '1 Edgewater Drive', 'Suite 105', 'Norwood', 'MA', '02062', '781-817-6686', '781-688-8948', 'Home Health', '42.16182', '-71.2015'),
(47, 'BOC', '6400 N. Congress Avenue ', 'Suite 2175', 'Boca Raton', 'FL', '33487', '561-327-7774', '561-227-9312', 'Home Health', '26.403475', '-80.10146'),
(48, 'BOS', '301 E. Jackson St. ', 'Suite A', 'Hugo', 'OK', '74743', '580-326-9558', '580-326-9566', 'Home Health', '34.01091', '-95.50994'),
(49, 'BOU', '215 N Convent Street', 'Suite 5', 'Bourbonnais', 'IL', '60914', '815-932-3640', '815-932-3643', 'Home Health', '41.15919', '-87.87546'),
(50, 'BRD', '4730 SR 64 East', 'Suite 201', 'Bradenton', 'FL', '34208', '941-527-0254', '941-527-0258', 'Home Health', '27.49644', '-82.50365'),
(51, 'BRN', '2510 Crockett Drive', 'Suite B', 'Brownwood', 'TX', '76801', '325-646-5565', '325-641-2399', 'Home Health', '31.68055', '-98.99319'),
(52, 'BSE', '9199 W Black Eagle Dr', '', 'Boise', 'ID', '83709', '208-672-1707', '208-672-1724', 'Home Health', '43.591756', '-116.296031'),
(53, 'BSH', '9199 W Black Eagle Dr', '', 'Boise', 'ID', '83709', '208-672-1707', '208-672-1724', 'Hospice', '43.591756', '-116.296031'),
(54, 'BTE', '1940 Dewey Boulevard', '', 'Butte', 'MT', '59701', '406-723-8933', '406-206-1173', 'Home Health', '45.9832', '-112.51018'),
(55, 'BTH', '1940 Dewey Blvd', '', 'Butte', 'MT', '59701', '406-723-8933', '406-206-1173', 'Hospice', '45.9832', '-112.51018'),
(56, 'BUH', '111 NW Newton', 'Suite A', 'Burleson', 'TX', '76028', '817-447-7312', '682-237-1480', 'Hospice', '32.5396', '-97.32983'),
(57, 'BUR', '111 NW Newton', 'Suite B', 'Burleson', 'TX', '76028', '817-426-3165', '817-426-3145', 'Home Health', '32.5396', '-97.32983'),
(58, 'BZH', '3810 Valley Commons Drive', 'Suite 1', 'Bozeman', 'MT', '59718', '406-585-1099', '406-206-1216', 'Hospice', '45.67183', '-111.089264'),
(59, 'BZM', '3810 Valley Commons Drive', 'Suite 1', 'Bozeman', 'MT', '59718', '406-586-0022', '406-206-1225', 'Home Health', '45.67183', '-111.089264'),
(60, 'CAH', '2002 Lay Dam Road', '', 'Clanton', 'AL', '35045', '205-755-4635', '205-755-5646', 'Hospice', '32.87632', '-86.62228'),
(61, 'CAN', '1575 Corporate Woods Parkway', 'Suite 200', 'Uniontown', 'OH', '44685', '330-409-7877', '330-493-0888', 'Home Health', '40.96392', '-81.46766'),
(62, 'CAT', '2002 Lay Dam Road', '', 'Clanton', 'AL', '35045', '205-755-6955', '205-755-5646', 'Home Health', '32.87632', '-86.62228'),
(63, 'CBD', '220 S. Canal St. ', 'Suite A', 'Carlsbad', 'NM', '88220', '575-887-6050', '575-887-8908', 'Home Health', '32.41845', '-104.22888'),
(64, 'CBH', '701 N. Canal St.', 'Suite A', 'Carlsbad', 'NM', '88220', '575-236-4844', '575-449-3220', 'Hospice', '32.4276', '-104.22904'),
(65, 'CEN', '2318 W 7th Street', '', 'Stillwater', 'OK', '74074', '405-707-8065', '405-707-8075', 'Home Health', '36.1148', '-97.08746'),
(66, 'CHA', '6025 Lee Highway', 'Suite 413', 'Chattanooga', 'TN', '37421', '423-414-3017', '423-238-1199', 'Home Health', '35.02793', '-85.1907'),
(67, 'CHH', '4024 Laramie Street', '', 'Cheyenne', 'WY', '82001', '307-634-5970', '307-634-5384', 'Hospice', '41.15177', '-104.76041'),
(68, 'CHI', '4705 E Hwy 37', '', 'Tuttle', 'OK', '73089', '405-381-9296', '405-381-9310', 'Home Health', '35.29147', '-97.72941'),
(69, 'CHN', '4024 Laramie Street', '', 'Cheyenne', 'WY', '82001', '307-634-5970', '307-634-5384', 'Home Health', '41.15177', '-104.76041'),
(70, 'CHP', '6025 Lee Highway ', 'Suite 413', 'Chattanooga', 'TN', '37421', '423-425-9926', '423-238-1199', 'Private Duty', '35.02793', '-85.1907'),
(71, 'CHV', '1024 Carrington Place', 'Suite 200', 'Charlottesville', 'VA', '22901', '434-202-7138', '434-202-7145', 'Home Health', '38.06982', '-78.46857'),
(72, 'CHY', '1401 Airport Parkway', 'Suite 220', 'Cheyenne', 'WY', '82001', '307-778-3000', '307-778-7922', 'Home Health', '41.15172', '-104.80488'),
(73, 'CLB', '7290 North Lake Drive', 'Suite 508', 'Columbus', 'GA', '31909', '706-327-6159', '706-576-3673', 'Home Health', '32.55021', '-84.95107'),
(74, 'CLE', '605 North Nolan River Drive', 'Suite 605D', 'Cleburne', 'TX', '76033', '817-558-4312', '817-558-4305', 'Home Health', '32.3405', '-97.42677'),
(75, 'CLH', '2305 Bluecutt Rd', 'Suite C', 'Columbus', 'MS', '39705', '662-854-0020', '662-244-5919', 'Hospice', '33.52495', '-88.42089'),
(76, 'CLM', '1635 E Highway 50', 'Suite 200-C', 'Clermont', 'FL', '34711', '352-242-1004', '352-242-1005', 'Home Health', '28.54652', '-81.72616'),
(77, 'CLR', '12727 Featherwood Drive', 'Suite 200', 'Houston', 'TX', '77034', '281-484-7070', '281-484-7098', 'Home Health', '29.61591', '-95.21184'),
(78, 'CLW', '4585 140th Ave. N. ', 'Suite H1006', 'Clearwater', 'FL', '33762', '727-532-9900', '727-532-9933', 'Home Health', '27.89923', '-82.69576'),
(79, 'CMB', '200 Center Point Circle', 'Suite 150', 'Columbia', 'SC', '29210', '803-638-4212', '803-638-4215', 'Home Health', '34.04277', '-81.10985'),
(80, 'CMC', '215 Mercer Place', '', 'Commerce', 'GA', '30529', '706-423-9781', '706-423-9742', 'Home Health', '34.23221', '-83.45382'),
(81, 'CNC', '108 Shuford Drive ', '', 'Columbus', 'NC', '28722', '828-894-8296', '828-894-0636', 'Home Health', '35.24234', '-82.20874'),
(82, 'COB', '1445 Highway 98 East', '', 'Columbia', 'MS', '39429', '601-736-9626', '601-736-9629', 'Home Health', '31.25133', '-89.78706'),
(83, 'COH', '1445 Highway 98 East', '', 'Columbia', 'MS', '39429', '601-731-1707', '601-731-5063', 'Hospice', '31.25133', '-89.78706'),
(84, 'COM', '8317 Wesley Street', '', 'Greenville', 'TX', '75402', '903-259-6817', '903-259-6900', 'Home Health', '33.08797', '-96.10918'),
(85, 'CON', '2201 Timberloch Place', 'Suite 225', 'The Woodlands', 'TX', '77380', '281-465-8812', '281-465-8917', 'Home Health', '30.15744', '-95.46927'),
(86, 'COS', '910 Pinon Ranch View', 'Suite 211', 'Colorado Springs', 'CO', '80907', '719-265-6931', '719-265-6934', 'Home Health', '38.90162', '-104.84432'),
(87, 'CPH', '907 N. Poplar Street', 'Suite 277', 'Casper', 'WY', '82601', '307-234-6684', '307-234-6066', 'Hospice', '42.85969', '-106.33135'),
(88, 'CPR', '907 N. Poplar Street', 'Suite 277', 'Casper', 'WY', '82601', '307-234-6684', '307-234-6066', 'Home Health', '42.85969', '-106.33135'),
(89, 'CRC', '5656 S Staples Street', 'Suite 302', 'Corpus Christi', 'TX', '78411', '361-986-0272', '361-985-1219', 'Home Health', '27.69867', '-97.37488'),
(90, 'CSH', '3600 Highway 6 South', 'Suite 100', 'College Station', 'TX', '77845', '979-268-4710', '979-268-4726', 'Hospice', '30.59006', '-96.28972'),
(91, 'CTN', '194 William E. Hill Drive', '', 'Carrollton', 'AL', '35447', '205-367-2407', '205-367-2197', 'Home Health', '33.274676', '-88.090731'),
(92, 'CUH', '1311 2nd Avenue SW', 'Suite B2', 'Cullman', 'AL', '35055', '256-739-5557', '256-739-9018', 'Hospice', '34.16341', '-86.83743'),
(93, 'CUL', '1311 2nd Avenue SW', 'Suite B1', 'Cullman', 'AL', '35055', '256-739-9016', '256-739-9018', 'Home Health', '34.16341', '-86.83743'),
(94, 'CVL', '34 Medical Park Boulevard', 'Suite G-H', 'Petersburg', 'VA', '23805', '804-541-6224', '804-541-6244', 'Home Health', '37.18196', '-77.36534'),
(95, 'DEC', '115 Johnston Street SE', 'Suite 301A', 'Decatur', 'AL', '35601', '256-355-5746', '256-350-8962', 'Home Health', '34.60275', '-86.9858'),
(96, 'DEH', '115 Johnston Street SE', 'Suite 301B', 'Decatur', 'AL', '35601', '256-355-2759', '256-350-8962', 'Hospice', '34.60275', '-86.9858'),
(97, 'DEN', '6021 S Syracuse Way', 'Suite 204', 'Greenwood Village', 'CO', '80111', '303-722-0857', '303-722-2943', 'Home Health', '39.60519', '-104.89984'),
(98, 'DES', '2340 S. River Road', 'Suite 400', 'Des Plaines', 'IL', '60018', '847-803-0774', '847-803-0821', 'Home Health', '42.01082', '-87.87124'),
(99, 'DHH', '805 E. Lee St.', 'Suite C', 'Enterprise', 'AL', '36330', '334-699-2010', '334-673-2133', 'Hospice', '31.32611', '-85.8429'),
(100, 'DHN', '3379 W Main Street', 'Suite 1', 'Dothan', 'AL', '36305', '334-673-2126', '334-673-2133', 'Home Health', '31.2294', '-85.44291'),
(101, 'DLH', '10300 North Central Expressway', 'Suite 358', 'Dallas', 'TX', '75231', '469-677-3100', '214-363-4348', 'Hospice', '32.88583', '-96.76889'),
(102, 'DLS', '10300 North Central Expressway', 'Suite 355', 'Dallas', 'TX', '75231', '214-503-7700', '214-503-1221', 'Home Health', '32.88583', '-96.76889'),
(103, 'DNH', '1355 S. Colorado Blvd. ', 'Suite 604', 'Denver', 'CO', '80222', '303-940-9999', '303-421-2889', 'Hospice', '39.69155', '-104.94115'),
(104, 'DNO', '9351 Grant Street', 'Suite 275', 'Thornton', 'CO', '80229', '303-586-9112', '303-524-3711', 'Home Health', '39.86666', '-104.98607'),
(105, 'DOH', '3379 W. Main Street', 'Suite 2', 'Dothan', 'AL', '36305', '334-671-2290', '334-671-2291', 'Hospice', '31.2294', '-85.44291'),
(106, 'DOS', '2784 US Highway 190 W', 'Suite 300', 'Livingston', 'TX', '77351', '936-247-4700  ', '936-205-2149', 'Home Health', '30.72413', '-94.96813'),
(107, 'DOT', '3379 W. Main Street', 'Suite 3', 'Dothan', 'AL', '36305', '334-793-5758', '334-677-1174', 'Home Health', '31.2294', '-85.44291'),
(108, 'DTN', '1809 Hinkle Drive', 'Suite 150', 'Denton', 'TX', '76201', '940-382-2840', '940-382-5115', 'Home Health', '33.23047', '-97.144695'),
(109, 'DUN', '150 E Highway 67', 'Suite 250', 'Duncanville', 'TX', '75137', '972-298-3400', '972-298-3408', 'Home Health', '32.62553', '-96.90622'),
(110, 'DUR', '614 N Washington Avenue', 'Suites A & B', 'Durant', 'OK', '74701', '580-920-1470', '580-920-1462', 'Home Health', '33.99989', '-96.39009'),
(111, 'EAS', '300 West Main Street', '', 'Eastland', 'TX', '76448', '254-629-8200', '254-629-8220', 'Home Health', '32.401615', '-98.81972'),
(112, 'EAT', '117 Harmony Crossing', 'Suite 7', 'Eatonton', 'GA', '31024', '706-485-7188', '706-484-0882', 'Home Health', '33.42418', '-83.26897'),
(113, 'ELB', '600 Chandler St. ', '', 'Hartwell', 'GA', '30643', '706-283-7395', '706-213-7524', 'Home Health', '34.36177', '-82.93493'),
(114, 'ELP', '3821 Constitution Drive', 'Suite 400', 'El Paso', 'TX', '79922', '915-845-3300', '915-845-3661', 'Home Health', '31.81299', '-106.55219'),
(115, 'ENT', '1208 Rucker Boulevard', 'Suite A', 'Enterprise', 'AL', '36330', '334-393-9810', '334-393-9581', 'Home Health', '31.32713', '-85.81895'),
(116, 'EPH', '3817 Constitution Drive', 'Suite 200', 'El Paso', 'TX', '79922', '915-300-2228', '915-301-1947', 'Hospice', '31.81258', '-106.55123'),
(117, 'EPR', '300 Toll Gate Rd. ', 'Suite 301', 'Warwick ', 'RI', '02886', '401-431-0200', '401-431-0204', 'Home Health', '41.7021', '-71.47365'),
(118, 'EUF', '1560 South Eufaula Avenue', 'Suite 6', 'Eufaula', 'AL', '36027', '334-687-2271', '334-687-4915', 'Home Health', '31.87356', '-85.15437'),
(119, 'EZT', '1690 Ring Road', 'Suite 260', 'Elizabethtown', 'KY', '42701', '270-766-1444', '270-766-1467', 'Home Health', '37.73106', '-85.87707'),
(120, 'FAY', '1585 Highway 34 E', 'Suite A', 'Newnan', 'GA', '30265', '770-716-7265', '770-716-7323', 'Home Health', '33.3979', '-84.72697'),
(121, 'FBG', '10712 Ballantraye Drive ', 'Suite 306 ', 'Fredericksburg', 'VA', '22407', '540-656-2660', '540-656-2534', 'Home Health', '38.24567', '-77.51308'),
(122, 'FRE', '108 East Trailmoor Dr. ', 'Suite 1', 'Fredericksburg', 'TX', '78624', '830-990-2423', '830-990-2430', 'Home Health', '30.28571', '-98.85981'),
(123, 'FRH', '435 South Whitley Drive', '', 'Fruitland', 'ID', '83619', '208-452-4972', '208-452-4974', 'Hospice', '44.00685', '-116.92585'),
(124, 'FRU', '435 South Whitley Drive', '', 'Fruitland', 'ID', '83619', '208-452-4972', '208-452-4974', 'Home Health', '44.00685', '-116.92585'),
(125, 'FTC', '2171 Citrine Court', '', 'Loveland', 'CO', '80537', '970-493-8500', '970-493-8508', 'Home Health', '40.40015', '-105.04581'),
(126, 'FTW', '6500 West Fwy', 'Suite 450', 'Fort Worth', 'TX', '76116', '817-737-4300', '817-737-4305', 'Home Health', '32.73556', '-97.42905'),
(127, 'FVB', '540 E Appleby Road', 'Suite 103', 'Fayetteville', 'AR', '72703', '479-636-2611', '479-442-6365', 'Home Health', '36.10543', '-94.15093'),
(128, 'FVW', '540 E Appleby Road', 'Suite 102', 'Fayetteville', 'AR', '72703', '479-442-6363', '479-442-6365', 'Home Health', '36.10543', '-94.15093'),
(129, 'FWH', '6500 West Fwy', 'Suite 451', 'Fort Worth', 'TX', '76116', '817-263-8808', '817-263-8811', 'Hospice', '32.73556', '-97.42905'),
(130, 'GAD', '310 S 3rd St', '', 'Gadsden', 'AL', '35901', '256-546-5223', '256-546-6618', 'Home Health', '34.00931', '-86.00375'),
(131, 'GAH', '310 South 3rd St', '', 'Gadsden', 'AL', '35901', '256-546-6993', '256-546-6618', 'Hospice', '34.00931', '-86.00375'),
(132, 'GBO', '5 Oak Branch Drive', 'Suite 5E', 'Greensboro', 'NC', '27407', '336-274-6937', '336-274-7448', 'Home Health', '36.05883', '-79.86074'),
(133, 'GDH', '101 Church Street', '', 'Rainbow City', 'AL', '35906', '256-467-3568', '256-442-9648', 'Hospice', '33.95502', '-86.03945'),
(134, 'GEN', '1601 Main Street', 'Suite 504', 'Richmond', 'TX', '77469', '281-342-2326', '281-341-5886', 'Home Health', '29.57706', '-95.76879'),
(135, 'GLF', '11703 Highland Circle', 'Suite A', 'Gulfport', 'MS', '39503', '228-374-2273', '228-432-0522', 'Home Health', '30.460625', '-89.02036'),
(136, 'GLH', '11703 Highland Circle', 'Suite B ', 'Gulfport', 'MS', '39503', '228-374-4434', '228-436-3679', 'Hospice', '30.460625', '-89.02036'),
(137, 'GLN', '7121 West Bell Road', 'Suite 10L', 'Glendale', 'AZ', '85308', '623-334-5454', '623-334-5364', 'Home Health', '33.63807', '-112.21159'),
(138, 'GNS', '601 Broad Street SE', 'Suite F', 'Gainesville', 'GA', '30501', '770-536-0497', '770-536-0157', 'Home Health', '34.30107', '-83.82108'),
(139, 'GNV', '300 N. Highland Avenue', 'Suite 510', 'Sherman', 'TX', '75092', '903-813-3238', '903-892-3592', 'Home Health', '33.63717', '-96.62387'),
(140, 'GRE', '321 Greenville Byp', 'Suite 1', 'Greenville', 'AL', '36037', '256-273-7773', '334-777-2044', 'Home Health', '31.84983', '-86.63061'),
(141, 'GRH', '321 Greenville Bypass', 'Suite 1', 'Greenville', 'AL', '36037', '256-273-7778', '334-777-2044', 'Hospice', '31.84983', '-86.63061'),
(142, 'GRN', '401 Temple Hall Highway', 'Suite 5', 'Granbury', 'TX', '76049', '817-279-1665', '817-533-2832', 'Home Health', '32.470973', '-97.715052'),
(143, 'GTN', '285 SE Inner Loop', 'Suite 108', 'Georgetown', 'TX', '78626', '512-763-1393', '512-763-1419', 'Home Health', '30.60794', '-97.68029'),
(144, 'H14', '14800 San Pedro Ave', 'Suite 200', 'San Antonio', 'TX', '78232', '210-824-0144', '210-824-0148', 'Home Health', '29.57623', '-98.47725'),
(145, 'HAH', '311 State Highway 17', 'Suite 3', 'Hamilton', 'AL', '35570', '205-921-1702', '205-623-2983', 'Hospice', '34.13714', '-87.99301'),
(146, 'HAM', '311 State Highway 17', 'Suite 3', 'Hamilton', 'AL', '35570', '205-921-2150', '205-623-2983', 'Home Health', '34.13714', '-87.99301'),
(147, 'HBG', '133 Mayfair Road', '', 'Hattiesburg', 'MS', '39402', '601-268-0408', '601-264-2134', 'Home Health', '31.32098', '-89.36216'),
(148, 'HBH', '133 Mayfair Road', '', 'Hattiesburg', 'MS', '39402', '601-264-8691', '601-264-8692', 'Hospice', '31.32098', '-89.36216'),
(149, 'HCH', '2 South Main Street', 'Suite 1-D', 'Heber City', 'UT', '84032', '435-654-1464', '435-657-1612', 'Hospice', '40.50744', '-111.41368'),
(150, 'HEB', '2 South Main Street', 'Suite 1-D', 'Heber City', 'UT', '84032', '435-654-1464', '435-657-1612', 'Home Health', '40.50744', '-111.41368'),
(151, 'HEN', '107 SW 2nd Street', '', 'Checotah', 'OK', '74426', '918-473-0123', '918-4730124', 'Home Health', '35.470478', '-95.525463'),
(152, 'HHD', '1 Westbury Parkway', 'Suite 250', 'Bluffton', 'SC', '29910', '843-837-4404 ', '843-628-0699', 'Home Health', '32.243281', '-80.856752'),
(153, 'HIA', '349 Towne Place', '', 'Hiawassee', 'GA', '30546', '706-896-5037', '706-896-1471', 'Home Health', '34.94418', '-83.74885'),
(154, 'HLH', '800 Front Street', '', 'Helena', 'MT', '59601', '406-443-4140', '406-206-1244', 'Hospice', '46.59499', '-112.03698'),
(155, 'HLN', '800 Front Street', '', 'Helena', 'MT', '59601', '406-443-4140', '406-206-1244', 'Home Health', '46.59499', '-112.03698'),
(156, 'HLS', '305 Coke Avenue', 'Suite 150', 'Hillsboro', 'TX', '76645', '254-580-1616', '254-580-1625', 'Home Health', '32.00665', '-97.0982'),
(157, 'HND', '8905 S. Pecos Road', 'Suite 24A', 'Henderson', 'NV', '89074', '725-605-2727', '725-605-2828', 'Home Health', '36.02732', '-115.10122'),
(158, 'HOH', '12727 Featherwood Dr. ', 'Suite 295', 'Houston', 'TX', '77034', '713-476-0270', '713-476-0258', 'Hospice', '29.61591', '-95.21184'),
(159, 'HOU', '701 North Post Oak Road', 'Suite 101', 'Houston', 'TX', '77024', '713-683-1021', '713-683-1020', 'Home Health', '29.77988', '-95.45786'),
(160, 'HST', '15840 FM 529', 'Suite 302', 'Houston', 'TX', '77095', '281-861-6635', '281-861-7297', 'Home Health', '29.87978', '-95.64908'),
(161, 'HTC', '111 North Main Street', '', 'Hutchinson', 'KS', '67501', '620-662-9238', '620-662-4460', 'Home Health', '38.05406', '-97.93233'),
(162, 'HUH', '802 Shoney Dr SW', 'Suite D', 'Huntsville', 'AL', '35801', '256-883-7445', '256-885-1638', 'Hospice', '34.70214', '-86.58459'),
(163, 'HUN', '802 Shoney Dr SW', 'Suite D', 'Huntsville', 'AL', '35801', '256-881-7201', '256-885-1638', 'Home Health', '34.70214', '-86.58459'),
(164, 'HVH', '9668 Madison Blvd.', 'Suite 335', 'Madison', 'AL', '35758', '256-203-8508', '256-288-0822', 'Hospice', '34.66599', '-86.78015'),
(165, 'IDA', '1928 SE Washington St. ', '', 'Idabel', 'OK', '74745', '580-208-3700', '580-208-3701', 'Home Health', '33.89527', '-94.80102'),
(166, 'IDF', '3686 Washington Parkway', '', 'Idaho Falls', 'ID', '83404', '208-528-8100', '208-522-5232', 'Home Health', '43.46424', '-111.99366'),
(167, 'IFH', '3686 Washington Parkway', '', 'Idaho Falls', 'ID', '83404', '208-528-8100', '208-522-5232', 'Hospice', '43.46424', '-111.99366'),
(168, 'JAX', '9143 Philips Highway', 'Suite 535', 'Jacksonville', 'FL', '32256', '904-296-1913', '904-296-1915', 'Home Health', '30.20078', '-81.57109'),
(169, 'JKH', '225 Katherine Drive', '', 'Flowood', 'MS', '39232', '601-932-9066', '601-933-0811', 'Hospice', '32.33337', '-90.09441'),
(170, 'JKS', '225 Katherine Drive', '', 'Flowood', 'MS', '39232', '601-939-6428', '601-939-1628', 'Home Health', '32.33337', '-90.09441'),
(171, 'JSH', '3699 Industrial Pkwy', '', 'Jasper', 'AL', '35501', '205-221-3909', '205-221-5669', 'Hospice', '33.8065', '-87.23497'),
(172, 'JSP', '3699 Industrial Pkwy', '', 'Jasper', 'AL', '35501', '205-221-3537', '205-221-5669', 'Home Health', '33.8065', '-87.23497'),
(173, 'KCH', '14833 W 95th Street', '', 'Lenexa', 'KS', '66215', '913-948-8281', '913-948-8282', 'Hospice', '38.95563', '-94.75919'),
(174, 'KCK', '14831 W 95th Street', '', 'Lenexa', 'KS', '66215', '913-334-1058', '913-334-1196', 'Home Health', '38.95563', '-94.7591'),
(175, 'KCM', '941 NE Columbus Street', '', 'Lee\'s Summit', 'MO', '64086', '816-347-1426', '816-347-1504', 'Home Health', '38.92065', '-94.3591'),
(176, 'KMH', '943 NE Columbus Street', '', 'Lee\'s Summit', 'MO', '64086', '816-347-1426', '816-347-1504', 'Hospice', '38.920915', '-94.35897'),
(177, 'KNG', '302 N. Indepenence', 'Suite 400', 'Enid', 'OK', '73701', '405-358-7770', '405-758-4062', 'Home Health', '36.39967', '-97.88032'),
(178, 'KPH', '42 Bruyer Way', '', 'Kalispell', 'MT', '59901', '406-755-4923', '406-206-1245', 'Hospice', '48.22933', '-114.30902'),
(179, 'KSS', '5900 Lake Ellenor Dr. ', 'Suite 200', 'Orlando ', 'FL', '32809', '407-846-2252', '407-846-2256', 'Home Health', '28.47026', '-81.40428'),
(180, 'KTN', '404 West Race Street', '', 'Kingston', 'TN', '37763', '865-882-5477', '865-882-9940', 'Home Health', '35.8803', '-84.52465'),
(181, 'KWD', '800 Rockmead Dr. ', 'Suite 250', 'Kingwood', 'TX', '77339', '281-570-2927', '281-913-5809', 'Home Health', '30.05322', '-95.24291'),
(182, 'KXP', '900 E. Hill Avenue ', 'Suites 115 and 120', 'Knoxville', 'TN', '37915', '865-584-4010', '865-862-0643', 'Private Duty', '35.961891', '-83.913185'),
(183, 'KXV', '900 E. Hill Avenue ', 'Suites 115 and 120', 'Knoxville', 'TN', '37915', '865-686-6554', '865-588-2045', 'Home Health', '35.961891', '-83.913185'),
(184, 'LAH', '230 North 1st Street', '', 'Lander', 'WY', '82520', '307-332-2922', '307-332-0106', 'Hospice', '42.83399', '-108.72646'),
(185, 'LAK', '130 Fitzgerald Road', 'Suite 2', 'Lakeland', 'FL', '33813', '863-644-1122', '863-644-1124', 'Home Health', '27.96782', '-81.96315'),
(186, 'LAN', '230 North 1st Street', '', 'Lander', 'WY', '82520', '307-332-2922', '307-332-0106', 'Home Health', '42.83399', '-108.72646'),
(187, 'LAS', '425 S Telshor Boulevard', 'Suite 201-C', 'Las Cruces', 'NM', '88011', '575-532-1358', '575-532-1450', 'Home Health', '32.31716', '-106.74634'),
(188, 'LAW', '6202 NW Oak Ave', '', 'Lawton', 'OK', '73505', '580-248-7400', '580-248-7401', 'Home Health', '34.62212', '-98.46792'),
(189, 'LBG', '306 Gristmill Drive', 'Unit C', 'Forest', 'VA', '24551', '434-846-3300', '434-846-5997', 'Home Health', '37.37685', '-79.24578'),
(190, 'LCH', '425 S Telshor Boulevard', 'Suite 201-B', 'Las Cruces', 'NM', '88011', '575-323-9845', '575-449-3226', 'Hospice', '32.31716', '-106.74634'),
(191, 'LEX', '729 Vineyards Crossing', '', 'Lexington', 'NC', '27295', '336-249-7813', '336-249-8018', 'Home Health', '35.838742', '-80.285823'),
(192, 'LGR', '2502 Cove Avenue ', 'Suite A', 'La Grande', 'OR', '97850', '541-663-8912', '541-663-8923', 'Home Health', '45.32574', '-118.0735'),
(193, 'LME', '1275 N. 15th Street ', 'Suite 121', 'Laramie', 'WY', '82072', '307-721-2827', '307-742-3611', 'Home Health', '41.32317', '-105.57548'),
(194, 'LNG', '407 E Methvin Street', 'Suite 300 ', 'Longview', 'TX', '75601', '903-238-9029', '903-238-9108', 'Home Health', '32.49526', '-94.73407'),
(195, 'LOG', '525 West 465 North', 'Suite 100', 'Providence', 'UT', '84332', '435-753-7001', '435-753-7088', 'Home Health', '41.71715', '-111.83062'),
(196, 'LOH', '525 West 465 North', 'Suite 100', 'Providence', 'UT', '84332', '435-753-7001', '435-753-7088', 'Hospice', '41.71715', '-111.83062'),
(197, 'LUB', '4225 85th Street', '', 'Lubbock', 'TX', '79423', '806-794-3555', '806-794-9303', 'Home Health', '33.51585', '-101.90262'),
(198, 'LUC', '2210 Mill St Extension ', 'Suite J', 'Lucedale', 'MS', '39452', '601-947-6645', '601-947-6702', 'Home Health', '30.90863', '-88.58784'),
(199, 'LUF', '1607 S Chestnut', 'Suite K', 'Lufkin', 'TX', '75901', '936-632-8877', '936-632-8911', 'Home Health', '31.31755', '-94.71145'),
(200, 'LVH', '2325 Renaissance Drive', 'Suite A', 'Las Vegas', 'NV', '89119', '702-568-1176', '702-568-0034', 'Hospice', '36.10303', '-115.12074'),
(201, 'LVS', '6080 S Fort Apache Road', 'Suite 105A', 'Las Vegas', 'NV', '89148', '702-384-1962', '702-384-3450', 'Home Health', '36.07839', '-115.29748'),
(202, 'LWH', '884 Legacy Park Drive', 'Suite 201 & 202', 'Lawrenceville', 'GA', '30043', '678-805-8439 ', '678-376-0886', 'Hospice', '33.965625', '-84.024453'),
(203, 'LWR', '884 Legacy Park Drive', 'Suite 101 & 102', 'Lawrenceville', 'GA', '30043', '678-325-2350', '678-325-2351', 'Home Health', '33.965625', '-84.024453'),
(204, 'LWV', '1979 Lakeside Pkwy', 'Suite 150', 'Tucker', 'GA', '30084', '770-682-6262', '770-682-0626', 'Home Health', '33.8412', '-84.24105'),
(205, 'LXT', '2365 Harrodsburg Rd', 'Suite B425', 'Lexington', 'KY', '40504', '859-317-9793', '270-495-4290', 'Home Health', '38.02058', '-84.54559'),
(206, 'MAC', '1760 Bass Road ', 'Suite 201', 'Macon', 'GA', '31210', '478-742-7557', '478-742-8491', 'Home Health', '32.9371', '-83.72139'),
(207, 'MAM', '12400 SW 127th Avenue', '', 'Miami', 'FL', '33186', '786-596-3010', '786-533-9493', 'Home Health', '25.65383', '-80.39949'),
(208, 'MAR', '300 E Main Street', 'Suite 200', 'Nacogdoches', 'TX', '75961', '936-564-3700', '936-564-0675', 'Home Health', '31.60259', '-94.65437'),
(209, 'MBH', '1301 Harrison Ave. ', 'Suite B ', 'McComb', 'MS', '39648', '601-684-5033', '601-684-2758', 'Hospice', '31.249265', '-90.467901'),
(210, 'MCD', '70 N Main St', 'Suite 3', 'Marion', 'NC', '28752', '828-659-6901', '828-659-6401', 'Home Health', '35.68521', '-82.00937'),
(211, 'MCH', '1760 Bass Road', 'Suite 202', 'Macon', 'GA', '31210', '478-474-1155', '478-474-1158', 'Hospice', '32.9371', '-83.72139'),
(212, 'MCK', '780 North Watters Road', 'Suite 160', 'Allen', 'TX', '75013', '214-383-9880', '214-383-9875', 'Home Health', '33.1094', '-96.68027'),
(213, 'MFH', '1002 Marble Heights Drive', 'Suite B2', 'Marble Falls', 'TX', '78654', '830-262-0808', '830-399-4751', 'Hospice', '30.586605', '-98.270829'),
(214, 'MGE', '310 Second Street SE', '', 'Magee', 'MS', '39111', '601-849-1647', '601-849-4714', 'Home Health', '31.87135', '-89.72309'),
(215, 'MGH', '128 North Washington ', '', 'Magnolia', 'AR', '71753', '870-901-0500', '870-901-0502', 'Hospice', '33.26801', '-93.24008'),
(216, 'MIA', '101 S Main Street', '', 'Miami', 'OK', '74354', '918-540-2333', '918-541-1665', 'Home Health', '36.87326', '-94.8772'),
(217, 'MID', '1004 N. Big Spring Street', 'Suite 515', 'Midland', 'TX', '79701', '432-570-8899', '432-570-5669', 'Home Health', '32.00709', '-102.07818'),
(218, 'MIH', '2419 Mullan Road', 'Suite D', 'Missoula', 'MT', '59808', '406-540-1512', '406-206-1253', 'Hospice', '46.881966', '-114.028726'),
(219, 'MIL', '111 Chase Court NW', '', 'Milledgeville', 'GA', '31061', '478-452-0246', '478-452-0273', 'Home Health', '33.09737', '-83.25549'),
(220, 'MOB', '316 Bel Air Boulevard', 'Suite 100A', 'Mobile', 'AL', '36609', '251-661-5313', '251-666-8968', 'Home Health', '30.674763', '-88.118337'),
(221, 'MOH', '316 Bel Air Blvd', 'Suite 100B', 'Mobile', 'AL', '36606', '251-666-2399', '251-666-8968', 'Hospice', '30.674763', '-88.118337'),
(222, 'MRH', '1000 Cobb Place Boulevard NW', 'Suite 310', 'Kennesaw', 'GA', '30144', '678-218-5745', '770-794-8302', 'Hospice', '34.00743', '-84.58631'),
(223, 'MRT', '1000 Cobb Place Boulevard NW', 'Suite 310', 'Kennesaw', 'GA', '30144', '678-354-1456', '678-354-5241', 'Home Health', '34.00743', '-84.58631'),
(224, 'MSH', '2713 Avalon Ave', '', 'Muscle Shoals', 'AL', '35661', '256-381-9254', '256-386-0830', 'Hospice', '34.74521', '-87.62904'),
(225, 'MSL', '2713 Avalon Ave', '', 'Muscle Shoals', 'AL', '35661', '256-381-9247', '256-386-0830', 'Home Health', '34.74521', '-87.62904'),
(226, 'MTG', '4782 Woodmere Blvd', '', 'Montgomery', 'AL', '36106', '334-244-9125', '334-244-9604', 'Home Health', '32.35526', '-86.22498'),
(227, 'MTH', '4782 Woodmere Blvd', '', 'Montgomery', 'AL', '36106', '334-272-3538', '334-244-9604', 'Hospice', '32.35526', '-86.22498'),
(228, 'MUR', '1535 W Northfield Boulevard', 'Suite 1', 'Murfreesboro', 'TN', '37129', '615-895-8383', '615-895-1898', 'Home Health', '35.87188', '-86.41147'),
(229, 'MUS', '111 S York St', '', 'Muskogee', 'OK', '74403', '918-682-6202', '918-682-6373', 'Home Health', '35.73827', '-95.34055'),
(230, 'NAM', '16151 N Brinson Street', '', 'Nampa', 'ID', '83687', '208-461-1600', '208-461-4251', 'Home Health', '43.60717', '-116.51596'),
(231, 'NED', '350 Pine Street', 'Suite 305', 'Beaumont', 'TX', '77701', '409-813-8109', '409-212-9079', 'Home Health', '30.08535', '-94.09741'),
(232, 'NFK', '5029 Corporate Woods Drive', 'Suite C100', 'Virginia Beach', 'VA', '23462', '757-226-7560', '757-226-7561', 'Home Health', '36.83372', '-76.1545'),
(233, 'NMH', '16151 N Brinson Street', '', 'Nampa', 'ID', '83687', '208-461-1600', '208-498-1882', 'Hospice', '43.60717', '-116.51596'),
(234, 'NOR', '209 NW 48th Avenue', '', 'Norman', 'OK', '73072', '405-360-0041', '405-321-6647', 'Home Health', '35.21666', '-97.511735'),
(235, 'NPR', '8406 Massachusetts Avenue', 'Suite B-1', 'New Port Richey', 'FL', '34653', '727-376-3700', '727-376-8500', 'Home Health', '28.2583', '-82.67596'),
(236, 'NSH', '828 Royal Parkway', 'Suite 111', 'Nashville', 'TN', '37214', '615-889-3336', '615-889-3391', 'Home Health', '36.14356', '-86.66137'),
(237, 'NVH', '828 Royal Parkway', 'Suite 113', 'Nashville', 'TN', '37214', '615-889-3357', '615-982-6227', 'Hospice', '36.14356', '-86.66137'),
(238, 'OCL', '2143 E Fort King Street', 'Suite 102', 'Ocala', 'FL', '34471', '352-368-1672', '352-368-1751', 'Home Health', '29.18573', '-82.10862'),
(239, 'OGD', '5478 S Adams Avenue Parkway #1', '', 'Ogden', 'UT', '84405', '801-392-8880', '801-395-2498', 'Home Health', '41.164748', '-111.968475'),
(240, 'OGH', '5478 S Adams Avenue Parkway #1', '', 'Ogden', 'UT', '84405', '801-392-8880', '801-395-2498', 'Hospice', '41.164748', '-111.968475'),
(241, 'OKC', '4005 NW Expressway', 'Suite 650', 'Oklahoma City', 'OK', '73116', '405-722-0047', '405-722-0307', 'Home Health', '35.53706', '-97.59003'),
(242, 'OKH', '4005 NW Expressway', 'Suite 605', 'Oklahoma City', 'OK', '73116', '405-735-5121', '405-735-5479', 'Hospice', '35.53706', '-97.59003'),
(243, 'OMA', '800 Jasmine Street', 'Suite 2', 'Omak', 'WA', '98841', '509-422-8621', '509-422-1835', 'Home Health', '48.39706', '-119.54563'),
(244, 'OMH', '800 Jasmine Street', 'Suite 2', 'Omak', 'WA', '98841', '509-422-8621', '509-422-1835', 'Hospice', '48.39706', '-119.54563'),
(245, 'OML', '11155 Dolfield Boulevard', 'Suite 212', 'Owings Mills', 'MD', '21117', '443-213-8668', '443-471-8404', 'Home Health', '39.41691', '-76.80973'),
(246, 'ONE', '1409 Second Avenue E', 'Suite A', 'Oneonta', 'AL', '35121', '205-762-0999', '205-829-2431', 'Home Health', '33.960863', '-86.461123'),
(247, 'ONH', '1409 Second Avenue E', 'Suite A', 'Oneonta', 'AL', '35121', '205-762-0998', '205-829-2431', 'Hospice', '33.960863', '-86.461123'),
(248, 'ORH', '480 E 770 N', '', 'Orem', 'UT', '84097', '801-221-0669', '801-221-0797', 'Hospice', '40.310707', '-111.683772'),
(249, 'ORM', '480 E 770 N', '', 'Orem', 'UT', '84097', '801-221-0669', '801-221-0797', 'Home Health', '40.310707', '-111.683772'),
(250, 'OWA', '403 W. 2nd Avenue', 'Suite 100', 'Owasso', 'OK', '74055', '918-609-6568', '918-609-6593', 'Home Health', '36.26418', '-95.86065'),
(251, 'OWB', '2625 Frederica Street ', 'Suite 1A', 'Owensboro', 'KY', '42301', '270-685-4663', '270-685-4683', 'Home Health', '37.74952', '-87.11171'),
(252, 'OXH', '2714 West Oxford Loop', 'Suite 167', 'Oxford', 'MS', '38655', '662-238-7771', '662-238-7775', 'Hospice', '34.367738', '-89.571599'),
(253, 'PAL', '2256 South Sycamore Street', 'Suite 2', 'Palestine', 'TX', '75801', '903-723-3991', '903-723-1440', 'Home Health', '31.73078', '-95.62511'),
(254, 'PAN', '4001 W. 23rd Street', 'Suite C', 'Panama City', 'FL', '32405', '850-522-4211', '850-522-4207', 'Home Health', '30.18907', '-85.71048'),
(255, 'PBG', '300 Penn Center Blvd.', 'Suite 303', 'Pittsburgh', 'PA', '15235', '412-826-2799', '412-826-2779', 'Home Health', '40.428', '-79.81241'),
(256, 'PBH', '1000 Infinity Drive', 'Suite 300', 'Monroeville', 'PA', '15146', '724-510-7000', '724-498-4481', 'Hospice', '40.44202', '-79.71528'),
(257, 'PCH', '183 Vista Drive', 'Suite B', 'Pocatello', 'ID', '83201', '208-637-1100', '208-637-1102', 'Hospice', '42.879257', '-112.424144'),
(258, 'PEH', '74 Plaza Drive', 'Suite 1C', 'Pell City', 'AL', '35125', '205-338-3494', '205-338-6232', 'Hospice', '33.60397', '-86.28797'),
(259, 'PEL', '74 Plaza Drive', 'Suite 1C', 'Pell City', 'AL', '35125', '205-338-3250', '205-338-6232', 'Home Health', '33.60397', '-86.28797'),
(260, 'PIC', '1702 Hwy 11 North', 'Suite B', 'Picayune', 'MS', '39466', '601-799-5160', '601-799-5325', 'Home Health', '30.53967', '-89.6711'),
(261, 'PIH', '1702 Hwy 11 North', 'Suite B', 'Picayune', 'MS', '39466', '769-242-1208', '769-242-1209', 'Hospice', '30.53967', '-89.6711'),
(262, 'POC', '183 Vista Drive', 'Suite A', 'Pocatello', 'ID', '83201', '208-637-1100', '208-637-1102', 'Home Health', '42.879257', '-112.424144'),
(263, 'PRE', '1002 Marble Heights Drive', 'Suite B', 'Marble Falls', 'TX', '78654', '830-693-2657', '830-693-4085', 'Home Health', '30.58664', '-98.27071'),
(264, 'PRP', '2201 E Postal Drive', 'Units 5 & 6', 'Pahrump', 'NV', '89048', '775-751-5100', '775-727-4325', 'Home Health', '36.20311', '-115.9744'),
(265, 'PSG', '3420 Bienville Blvd.', 'Suite B', 'Ocean Springs', 'MS', '39564', '228-762-9355', '228-769-9741', 'Home Health', '30.41081', '-88.77675'),
(266, 'PUB', '1515 Fortino Boulevard', 'Suite 160', 'Pueblo', 'CO', '81008', '719-543-0641', '719-545-1987', 'Home Health', '38.31284', '-104.6275'),
(267, 'PVH', '1807 Station Drive ', 'Suite B', 'Prattville', 'AL', '36066', '334-289-1007', '334-289-1071', 'Hospice', '32.47991', '-86.41867'),
(268, 'RCK', '2080 Silas Deane Highway', '2nd Floor', 'Rocky Hill', 'CT', '06067', '860-529-5400', '860-529-5401', 'Home Health', '41.67155', '-72.64322'),
(269, 'RCM', '1606 Santa Rosa Road', 'Suite 134', 'Richmond', 'VA', '23229', '804-562-4252', '804-562-4290', 'Home Health', '37.60458', '-77.54809'),
(270, 'RDG', '1100 Berkshire Boulevard', 'Suite 210', 'Wyomissing', 'PA', '19610', '610-796-6473', '610-796-6491', 'Home Health', '40.3439', '-75.974'),
(271, 'REX', '859 S Yellowstone Hwy', 'Suite 201', 'Rexburg', 'ID', '83440', '208-356-7087', '208-356-6184', 'Home Health', '43.80787', '-111.80535'),
(272, 'RIC', '12355 Sunrise Valley Drive', 'Suite 230', 'Reston', 'VA', '20191', '703-992-7280', '703-992-6698', 'Home Health', '38.9505', '-77.37204'),
(273, 'RKV', '1395 Piccard Drive', 'Suite 310', 'Rockville', 'MD', '20850', '855-969-3346', '240-685-3404', 'Home Health', '39.10838', '-77.18081'),
(274, 'RMD', '100 Gateway Centre Parkway', 'Suite 205A', 'North Chesterfield', 'VA', '23235', '804-377-1188', '804-377-1189', 'Home Health', '37.49724', '-77.55823'),
(275, 'RMH', '100 Gateway Centre Pkwy', 'Suite 205B', 'North Chesterfield', 'VA', '23235', '804-726-2855', '804-726-2870', 'Hospice', '37.49724', '-77.55823'),
(276, 'RNH', '504 McCurdy Ave S', 'Suite 6', 'Rainsville', 'AL', '35986', '205-502-2599', '256-333-4563', 'Hospice', '34.488087', '-85.851242'),
(277, 'RNS', '504 McCurdy Ave S', 'Suite 6', 'Rainsville', 'AL', '35986', '205-502-2592', '256-333-4563', 'Home Health', '34.488087', '-85.851242'),
(278, 'ROA', '6701 Peters Creek Road', 'Suite 100', 'Roanoke', 'VA', '24019', '540-774-4970', '540-774-4972', 'Home Health', '37.34473', '-79.95886'),
(279, 'ROS', '400 North Pennsylvania Avenue', 'Suites 1250 & 1260', 'Roswell', 'NM', '88201', '575-622-9355', '575-622-9370', 'Home Health', '33.39705', '-104.52677'),
(280, 'RUH', '1096 Mechem Drive', 'Suite 302-B', 'Ruidoso', 'NM', '88345', '575-258-0028', '575-258-2648', 'Hospice', '33.35887', '-105.66468'),
(281, 'RUI', '1096 Mechem Drive', 'Suite 302-A', 'Ruidoso', 'NM', '88345', '575-258-0028', '575-258-2648', 'Home Health', '33.35887', '-105.66468'),
(282, 'RUT', '190 North Main Street', '', 'Rutherfordton', 'NC', '28139', '828-286-9097', '828-286-9093', 'Home Health', '35.36792', '-81.95693'),
(283, 'SAH', '12500 San Pedro Ave. ', 'Suite 250', 'San Antonio', 'TX', '78216', '210-901-7300', '210-308-3092', 'Hospice', '29.55575', '-98.48412'),
(284, 'SAL', '1502 West Chickasaw Avenue', 'Suite 6', 'Sallisaw', 'OK', '74955', '918-775-6100', '918-775-6110', 'Home Health', '35.45784', '-94.80812'),
(285, 'SAN', '334 W. Highland Blvd', '', 'San Angelo', 'TX', '76903', '325-486-0400', '325-486-0403', 'Home Health', '31.4517', '-100.43942'),
(286, 'SAP', '8161 State Highway 66', '', 'Tulsa', 'OK', '74131', '918-227-6400', '918-227-6404', 'Home Health', '36.04559', '-96.07876'),
(287, 'SBR', '106 Medical Center Ave.', '', 'Sebring', 'FL', '33870', '863-314-6038', '863-658-1930', 'Home Health', '27.46631', '-81.43178'),
(288, 'SBY', '801 E Naylor Mill Road', 'Suite D', 'Salisbury', 'MD', '21804', '410-219-5540', '410-219-7517', 'Home Health', '38.408562', '-75.591404'),
(289, 'SCH', '23820 John T Reid Pkwy', '', 'Scottsboro', 'AL', '35768', '256-574-5747', '256-333.4568', 'Hospice', '34.658395', '-86.021205'),
(290, 'SCO', '23820 John T Reid Pkwy', '', 'Scottsboro', 'AL', '35768', '256-259-1325', '256-574-4268', 'Home Health', '34.65734', '-86.02105'),
(291, 'SCT', '10619 N. Hayden Road', 'Building A; Suite 105', 'Scottsdale', 'AZ', '85260', '480-551-5468', '480-551-5398', 'Home Health', '33.584', '-111.90829'),
(292, 'SDA', '301 Oak Street', 'Suite E', 'Salida', 'CO', '81201', '719-539-7638', '719-530-0166', 'Home Health', '38.52975', '-105.9844'),
(293, 'SDH', '301 Oak Street', 'Suite E', 'Salida', 'CO', '81201', '719-539-7638', '719-530-0166', 'Hospice', '38.52975', '-105.9844'),
(294, 'SGH', '515 S. 300 E. ', 'Suite 109', 'St. George', 'UT', '84770', '435-634-9300', '435-652-1677', 'Hospice', '37.09936', '-113.5764'),
(295, 'SGR', '515 S. 300 E. ', 'Suite 105', 'St. George', 'UT', '84770', '435-634-9300', '435-652-1677', 'Home Health', '37.09936', '-113.5764'),
(296, 'SHR', '752 E. US HWY 30', '', 'Schererville', 'IN', '46375', '219-864-9988', '219-864-8782', 'Home Health', '41.48244', '-87.43331'),
(297, 'SLC', '990 West Bellwood Lane', '', 'Murray', 'UT', '84123', '801-747-5500', '801-747-5587', 'Home Health', '40.65353', '-111.91979'),
(298, 'SLH', '990 West Bellwood Lane', '', 'Murray', 'UT', '84123', '801-747-5500', '801-747-5587', 'Hospice', '40.65353', '-111.91979'),
(299, 'SMC', '2108 Hunter Road', 'Suite 106', 'San Marcos', 'TX', '78666', '512-392-5801', '512-392-5806', 'Home Health', '29.86477', '-97.96436'),
(300, 'SND', '601 Ferncrest Drive', 'Building B', 'Sandersville', 'GA', '31082', '478-552-8788', '478-552-8787', 'Home Health', '32.99591', '-82.8061'),
(301, 'SNR', '7771 W. Oakland Park Blvd. ', 'Suite 115', 'Sunrise', 'FL', '33351', '954-746-1347', '954-746-1375', 'Home Health', '26.16847', '-80.25252'),
(302, 'SOU', '1501 Hughes Rd.', 'Suite 100', 'Grapevine', 'TX', '76051', '817-329-5449', '817-329-2145', 'Home Health', '32.88854', '-97.09547'),
(303, 'SPF', '2970 Baker Street', '', 'Springfield', 'IL', '62703', '217-542-7138', '217-542-7119', 'Home Health', '39.76219', '-89.64378'),
(304, 'SPG', '5501 Backlick Road', 'Suite 250', 'Springfield', 'VA', '22151', '703-550-1400', '703-550-8860', 'Home Health', '38.80192', '-77.18341'),
(305, 'SPR', '487 Holyoke Street', 'Suite 1', 'Ludlow', 'MA', '01056', '413-610-2324', '413-610-2329', 'Home Health', '42.1816', '-72.50513'),
(306, 'SRS', '2201 Cantu Court', 'Suite 202', 'Sarasota', 'FL', '34232', '941-955-4600', '941-556-4900', 'Home Health', '27.31306', '-82.44905'),
(307, 'STB', '118 Hill Pond Lane', '', 'Statesboro', 'GA', '30458', '912-243-9040', '912-243-9043', 'Home Health', '32.412771', '-81.77267'),
(308, 'STH', '60 Physicians Lane ', 'Suite 2', 'Southaven', 'MS', '38671', '662-404-8899', '662-349-2129', 'Hospice', '34.96081', '-89.98886'),
(309, 'SVN', '125 Southern Junction Boulevard', 'Suite 207', 'Pooler', 'GA', '31322', '912-330-7394', '912-330-7399', 'Home Health', '32.13529', '-81.25846'),
(310, 'SWT', '1210 Hailey Street', '', 'Sweetwater', 'TX', '79556', '325-235-0888', '325-235-4803', 'Home Health', '32.48096', '-100.40076'),
(311, 'TAL', '2510 Miccosukee Road', 'Suite 110', 'Tallahassee', 'FL', '32308', '850-391-4754', '850-391-5810', 'Home Health', '30.4641', '-84.24061'),
(312, 'TEH', '2900 St. Michael Drive', 'Suite 400B', 'Texarkana', 'TX', '75503', '903-255-0430', '903-255-0433', 'Hospice', '33.46245', '-94.07724'),
(313, 'TEM', '1920 Birdcreek Drive', 'Suite 100', 'Temple', 'TX', '76502', '254-773-7740', '254-773-7745', 'Home Health', '31.08782', '-97.38753'),
(314, 'TEX', '2900 St. Michael Drive', 'Suite 400A', 'Texarkana', 'TX', '75503', '903-793-0264', '903-793-0269', 'Home Health', '33.46245', '-94.07724'),
(315, 'TFH', '1411 Falls Avenue East', 'Suite 815', 'Twin Falls', 'ID', '83301', '208-733-8600', '208-733-9449', 'Hospice', '42.57786', '-114.45665'),
(316, 'THO', '204 Cherokee Road', '', 'Thomaston', 'GA', '30286', '706-647-8911', '706-621-7126', 'Home Health', '32.886807', '-84.337525'),
(317, 'TMH', '1920 Birdcreek Drive', 'Suite 100B', 'Temple', 'TX', '76502', '254-677-7377', '254-488-5589', 'Hospice', '31.087833', '-97.387493'),
(318, 'TMP', '3804 Coconut Palm Drive', 'Suite 210', 'Tampa', 'FL', '33619', '813-963-0800', '813-963-0200', 'Home Health', '27.97959', '-82.35432'),
(319, 'TOC', '11 Business Center Drive ', 'Suites 102, 103, and 104', 'Eastanollee', 'GA', '30538', '706-297-7159', '706-297-7590', 'Home Health', '34.52641', '-83.25435'),
(320, 'TOH', '824 Hwy 231 S', '', 'Troy', 'AL', '36081', '334-566-9201', '334-566-9252', 'Hospice', '31.787487', '-85.96728'),
(321, 'TOY', '824 Hwy 231 S', '', 'Troy', 'AL', '36081', '334-566-9238', '334-566-9252', 'Home Health', '31.787487', '-85.96728'),
(322, 'TPE', '1270 E. Broadway Road', 'Suite 217', 'Tempe', 'AZ', '85282', '480-755-8888', '480-292-7847', 'Home Health', '33.40776', '-111.91804'),
(323, 'TPH', '499 Gloster Creek ', 'Suite I-7', 'Tupelo', 'MS', '38801', '662-844-2870', '662-844-2871', 'Hospice', '34.25195', '-88.71877'),
(324, 'TPK', '3620 SW Fairlawn Road', 'Suite 100', 'Topeka', 'KS', '66614', '785-232-8593', '785-232-8596', 'Home Health', '39.00163', '-95.74543'),
(325, 'TRH', '3809 East 9th Street', 'Suite 10', 'Texarkana', 'AR', '71854', '870-773-2621', '870-216-2177', 'Hospice', '33.43122', '-93.99898'),
(326, 'TRK', '3809 East 9th Street', 'Suite 12', 'Texarkana', 'AR', '71854', '870-773-4900', '870-772-9270', 'Home Health', '33.43122', '-93.99898'),
(327, 'TSH', '1913 West Tacoma Street', 'Suite E-F', 'Broken Arrow', 'OK', '74012', '918-893-1467', '918-893-1809', 'Hospice', '36.07053', '-95.81329'),
(328, 'TSN', '5920 E Pima Street', 'Suite 200', 'Tucson', 'AZ', '85712', '520-320-6578', '520-327-0163', 'Home Health', '32.24327', '-110.86591'),
(329, 'TUH', '100 Towncenter Blvd. ', 'Suite 200A', 'Tuscaloosa', 'AL', '35406', '205-345-4074', '205-332-3379', 'Hospice', '33.234081', '-87.535142'),
(330, 'TUL', '1913 West Tacoma Street', 'Suite G-H', 'Broken Arrow', 'OK', '74012', '918-524-1100', '918-524-1101', 'Home Health', '36.07053', '-95.81329'),
(331, 'TUS', '100 Towncenter Blvd. ', 'Suites 200 ', 'Tuscaloosa', 'AL', '35406', '205-345-5145', '205-345-6866', 'Home Health', '33.23418', '-87.53514'),
(332, 'TWF', '1411 Falls Avenue East', 'Suite 815', 'Twin Falls', 'ID', '83301', '208-733-8600', '208-733-9449', 'Home Health', '42.57786', '-114.45665'),
(333, 'TYH', '724 WSW Loop 323', 'Suite C', 'Tyler', 'TX', '75701', '903-405-3853', '903-705-0743', 'Hospice', '32.30204', '-95.3106'),
(334, 'TYL', '724 WSW Loop 323', 'Suite D', 'Tyler', 'TX', '75701', '903-526-4663', '903-525-6877', 'Home Health', '32.302035', '-95.310591'),
(335, 'VAL', '207 Fob James Drive', '', 'Valley', 'AL', '36854', '334-768-6225', '334-768-6233', 'Home Health', '32.814673', '-85.185043'),
(336, 'VDH', '1653 Carter Street', '', 'Vidalia', 'LA', '71373', '318-336-8989', '318-336-9876', 'Hospice', '31.57216', '-91.44546'),
(337, 'VKH', '2080 S Frontage Rd ', 'Suite 103', 'Vicksburg', 'MS', '39180', '601-631-8041', '601-638-7782', 'Hospice', '32.3221', '-90.86607'),
(338, 'VKS', '2080 S Frontage Rd ', 'Suite 103', 'Vicksburg', 'MS', '39180', '601-638-6606', '601-636-7926', 'Home Health', '32.3221', '-90.86607'),
(339, 'VRB', '79 Royal Palm Pt. ', 'Suite 100', 'Vero Beach', 'FL', '32960', '772-492-3591', '772-999-3720', 'Home Health', '27.646543', '-80.38007'),
(340, 'VRN', '131 1st Avenue NW', 'Suite B', 'Vernon', 'AL', '35592', '205-695-6736', '205-695-6764', 'Home Health', '33.757785', '-88.110384'),
(341, 'WAR', '319 Margie Drive', '', 'Warner Robins', 'GA', '31088', '478-971-1474', '478-971-1487', 'Home Health', '32.61233', '-83.69044'),
(342, 'WDH', '2201 Timberloch Place', 'Suite 225', 'The Woodlands', 'TX', '77380', '281-465-8397', '281-465-8710', 'Hospice', '30.15744', '-95.46927'),
(343, 'WEA', '1405 E Main Street', '', 'Weatherford', 'OK', '73096', '580-774-2201', '580-774-2172', 'Home Health', '35.52917', '-98.68971'),
(344, 'WES', '30 Riverside Drive', 'Suite 203', 'Lakeville', 'MA', '02347', '774-992-7068', '774-309-3567', 'Home Health', '41.87534', '-70.92036'),
(345, 'WFD', '1925 Martin Drive', 'Suite 100', 'Weatherford', 'TX', '76086', '817-341-4350', '817-341-4355', 'Home Health', '32.73333', '-97.79216');
INSERT INTO `wp_store_locations` (`id`, `branch_code`, `address1`, `address2`, `city`, `state`, `zip`, `telephone`, `faxnumber`, `service_line`, `latitude`, `longitude`) VALUES
(346, 'WIC', '8201 E. 34th Street Circle, Building 1500', 'Suite 1503', 'Wichita', 'KS', '67226', '316-267-4663', '316-522-2551', 'Home Health', '37.7465', '-97.37066'),
(347, 'WIF', '4001 Cedar Elm Lane', '', 'Wichita Falls', 'TX', '76308', '940-691-2273', '940-691-3364', 'Home Health', '33.86962', '-98.51638'),
(348, 'WIH', '8201 E. 34th Street Circle, Building 1500', 'Suite 1505', 'Wichita', 'KS', '67226', '316-267-4663', '316-522-2551', 'Hospice', '37.7465', '-97.37066'),
(349, 'WIN', '2068 Cowan Highway', '', 'Winchester', 'TN', '37398', '931-967-0633', '931-967-3380', 'Home Health', '35.17381', '-86.07926'),
(350, 'WMB', '4175 Ironbound Road', 'Suite 100 A', 'Williamsburg', 'VA', '23188', '757-585-2530', '757-645-4264', 'Home Health', '37.27532', '-76.73897'),
(351, 'WMH', '4175 Ironbound Road', 'Suite 100B', 'Williamsburg', 'VA', '23188', '757-585-3811', '757-819-4487', 'Hospice', '37.27532', '-76.73897'),
(352, 'WPB', '140 Intracoastal Pointe Drive', 'Suite 205', 'Jupiter', 'FL', '33477', '561-741-3995', '561-748-3305', 'Home Health', '26.93605', '-80.08861'),
(353, 'WRC', '255 Park Avenue ', 'Suite 1103', 'Worcester', 'MA', '01609', '774-243-9600', '774-243-9665', 'Home Health', '42.26491', '-71.81848'),
(354, 'YMA', '3860 W. 24th Street', 'Suite 103', 'Yuma', 'AZ', '85364', '928-317-1300', '928-317-1315', 'Home Health', '32.683925', '-114.66728'),
(355, 'YRK', '2315 Susquehanna Trail North', 'Suites B & C', 'York', 'PA', '17404', '717-767-8772', '717-767-8776', 'Home Health', '39.87982', '-76.70987');");

    //$wpdb->query($sql);
    //$wpdb->prepare($sql);
    $wpdb->query($sqlData);
}

register_activation_hook(__FILE__, 'eblm_install_data');


function eblm_update_db_check()
{
    global $eblm_db_version;
    if (get_site_option('eblm_db_version') != $eblm_db_version) {
        eblm_install();
    }
}

add_action('plugins_loaded', 'eblm_update_db_check');


if (!class_exists('WP_List_Table')) {
    require_once(ABSPATH . 'wp-admin/includes/class-wp-list-table.php');
}


class Custom_Table_Example_List_Table extends WP_List_Table
{
    function __construct()
    {
        global $status, $page;

        parent::__construct(array(
            'singular' => 'location',
            'plural' => 'locations',
        ));
    }


    function column_default($item, $column_name)
    {
        return $item[$column_name];
    }


    function column_phone($item)
    {
        return '<em>' . $item['phone'] . '</em>';
    }


    function column_branch_code($item)
    {

        $actions = array(
            'edit' => sprintf('<a href="?page=locations_form&id=%s">%s</a>', $item['id'], __('Edit', 'eblm')),
            'delete' => sprintf('<a href="?page=%s&action=delete&id=%s" onclick="return confirm(\'Are you sure?\')">%s</a>', $_REQUEST['page'], $item['id'], __('Delete', 'eblm')),
        );

        return sprintf('%s %s',
            $item['branch_code'],
            $this->row_actions($actions)
        );
    }


    function column_cb($item)
    {
        return sprintf(
            '<input type="checkbox" name="id[]" value="%s" />',
            $item['id']
        );
    }

    function get_columns()
    {
        $columns = array(
            'cb' => '<input type="checkbox" />',
            'branch_code' => __('Branch Code', 'eblm'),
            'address1' => __('Address1', 'eblm'),
            'address2' => __('Address2', 'eblm'),
            'city' => __('City', 'eblm'),
            'state' => __('State', 'eblm'),
            'zip' => __('Zip', 'eblm'),
            'telephone' => __('Telephone', 'eblm'),
            'faxnumber' => __('Faxnumber', 'eblm'),
            'service_line' => __('Service Line', 'eblm'),
            'latitude' => __('Latitude', 'eblm'),
            'longitude' => __('Longitude', 'eblm'),
        );
        return $columns;
    }

    function get_sortable_columns()
    {
        $sortable_columns = array(
            'branch_code' => array('branch_code', true),
            'address1' => array('address1', true),
            'address2' => array('address2', true),
            'city' => array('city', true),
            'state' => array('state', true),
            'zip' => array('zip', true),
            'telephone' => array('telephone', true),
            'faxnumber' => array('faxnumber', true),
            'service_line' => array('service_line', true),
            'latitude' => array('latitude', true),
            'longitude' => array('longitude', true),
        );
        return $sortable_columns;
    }

    function get_bulk_actions()
    {
        $actions = array(
            'delete' => 'Delete'
        );
        return $actions;
    }

    function process_bulk_action()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'store_locations';

        if ('delete' === $this->current_action()) {
            $ids = isset($_REQUEST['id']) ? $_REQUEST['id'] : array();
            if (is_array($ids)) $ids = implode(',', $ids);

            if (!empty($ids)) {
                $wpdb->query("DELETE FROM $table_name WHERE id IN($ids)");
            }
        }
    }

    function prepare_items()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'store_locations';

        $per_page = 10;

        $columns = $this->get_columns();
        $hidden = array();
        $sortable = $this->get_sortable_columns();

        $this->_column_headers = array($columns, $hidden, $sortable);

        $this->process_bulk_action();

        $total_items = $wpdb->get_var("SELECT COUNT(id) FROM $table_name");


        $paged = isset($_REQUEST['paged']) ? max(0, intval($_REQUEST['paged']) - 1) : 0;
        $orderby = (isset($_REQUEST['orderby']) && in_array($_REQUEST['orderby'], array_keys($this->get_sortable_columns()))) ? $_REQUEST['orderby'] : 'branch_code';
        $order = (isset($_REQUEST['order']) && in_array($_REQUEST['order'], array('asc', 'desc'))) ? $_REQUEST['order'] : 'asc';


        $this->items = $wpdb->get_results($wpdb->prepare("SELECT * FROM $table_name ORDER BY $orderby $order LIMIT %d OFFSET %d", $per_page, $paged), ARRAY_A);


        $this->set_pagination_args(array(
            'total_items' => $total_items,
            'per_page' => $per_page,
            'total_pages' => ceil($total_items / $per_page)
        ));
    }
}

function eblm_admin_menu()
{
    add_menu_page(__('Locations', 'eblm'), __('Locations', 'eblm'), 'activate_plugins', 'locations', 'eblm_locations_page_handler','dashicons-location');
    add_submenu_page('locations', __('Locations', 'eblm'), __('Locations', 'eblm'), 'activate_plugins', 'locations', 'eblm_locations_page_handler');

    add_submenu_page('locations', __('Add new', 'eblm'), __('Add new', 'eblm'), 'activate_plugins', 'locations_form', 'eblm_locations_form_page_handler');
    add_submenu_page('locations', __('Settings', 'eblm'), __('Settings', 'eblm'), 'activate_plugins', 'locations_settings', 'eblm_locations_settings_page_handler');
}

add_action('admin_menu', 'eblm_admin_menu');


function eblm_validate_location($item)
{
    $messages = array();

    if (empty($item['branch_code'])) $messages[] = __('Branch Code is required', 'eblm');
    if (empty($item['address1'])) $messages[] = __('Address1 is required', 'eblm');
    if (empty($item['city'])) $messages[] = __('City is required', 'eblm');
    if (empty($item['state'])) $messages[] = __('State is required', 'eblm');
    if (empty($item['zip'])) $messages[] = __('Zip is required', 'eblm');
    if (empty($item['city'])) $messages[] = __('City is required', 'eblm');
    if (!empty($item['telephone']) && !absint(intval($item['telephone']))) $messages[] = __('Telephone can not be less than zero');
    if (!empty($item['telephone']) && !preg_match('/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/', $item['telephone'])) $messages[] = __('Telephone must be number and proper format is "555-555-5555"');
    if (empty($item['faxnumber'])) $messages[] = __('Faxnumber is required', 'eblm');
    if (empty($item['latitude'])) $messages[] = __('Latitude is required', 'eblm');
    if (empty($item['longitude'])) $messages[] = __('Longitude is required', 'eblm');


    if (empty($messages)) return true;
    return implode('<br />', $messages);
}