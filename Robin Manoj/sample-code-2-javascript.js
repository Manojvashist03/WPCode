var internal_roles_checkbox = () => {
    
    document.getElementsByClassName("wrap-search")[0].appendChild(document.getElementById("ai-delete-selected"))
    document.getElementById("ai-delete-selected").style.display = 'inline-block'
    document.getElementById("ai-delete-selected").style.position = 'relative'
    document.getElementById("ai-delete-selected").style.bottom = '1.8em'
    document.getElementById("ai-delete-selected").style.left = '9em'
    document.getElementById("ai-delete-selected").style.float = 'right'
    document.getElementById("ai-delete-selected").style.fontSize = '0.9em'

}



internal_roles_checkbox_campare = () => {
    const roleidaaray = [];
    if(jQuery('.checkbox-me').is(":checked")){
        jQuery('.checkbox-me').each(function () {
            var id = jQuery(this).attr('id');
            if(jQuery('#'+id).is(":checked")) {
                jQuery('#'+id).each(function () {
                    var role_id = jQuery('#' + id).attr('data-uid');
                    jQuery('.ai-lightbox-model').attr('roleids');
                    roleidaaray.push(role_id);
                })
                console.log(roleidaaray);
                jQuery('.ai-lightbox-model').attr('roleids',roleidaaray);
            }

        });
    }
}

internal_roles_bulk = (id) =>{
    if (jQuery('#'+id).is(':checked')) {
        jQuery('.ai-row-checkbox').click();
    }else{
        jQuery('.ai-row-checkbox').click();
    }
}

var searchTable = () => {
    var input, filter, table, tr, td, i, txtValue;

    if (location.search.split('?')[1] == 'aipage=upload-roles'){
        document.getElementById("reset-search").style.display="inline-block"
        input = document.querySelectorAll("#search-me")[1]
        table = document.getElementsByClassName("from-roles-career-table the-table-results")[0]

        filter = input.value.toUpperCase();
        tr = table.getElementsByTagName("tr");
        
        for (i = 1; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];

            if (td) {
                txtValue = td.textContent || td.innerText;

                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
    else if(location.search.split('?')[1] == 'aipage=reports'){
        document.getElementById("reset-search").style.display="inline-block"
        var_data = document.getElementById('select-report-type').selectedOptions[0].value

        if(var_data == '1'){

            var_sub_data = document.getElementById('select-sub-type').selectedOptions[0].value
            if(var_sub_data == '2'){
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-cp-bm-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[1];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }   
            }
            else if(var_sub_data == 6){
                document.getElementById("reset-search").style.display="inline-block"
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-ncp-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[1];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }   
            }
            else if(var_sub_data == 5){
                document.getElementById("reset-search").style.display="inline-block"
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-cps-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[0];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }   
            }
            else if(var_sub_data == 4){
                document.getElementById("reset-search").style.display="inline-block"
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-cp-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[2];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }   
            }
        }
        else if(var_data == 3){
            document.getElementById("reset-search").style.display="inline-block"
            var_sub_data = document.getElementById('select-sub-type').selectedOptions[0].value
            if(var_sub_data == 11){
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-sur-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[1];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
            else if(var_sub_data == 7){
                document.getElementById("reset-search").style.display="inline-block"
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-cp-bm-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[1];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
            else if(var_sub_data == 10){
                document.getElementById("reset-search").style.display="inline-block"
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-nbm-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[1];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
            else if(var_sub_data == 9){
                document.getElementById("reset-search").style.display="inline-block"
                input = document.querySelectorAll("#search-me")[0]
                table = document.getElementsByClassName("reports-bmd-table the-table-results")[0]

                filter = input.value.toUpperCase();
                tr = table.getElementsByTagName("tr");
                
                for (i = 1; i < tr.length; i++) {
                    td = tr[i].getElementsByTagName("td")[1];

                    if (td) {
                        txtValue = td.textContent || td.innerText;

                        if (txtValue.toUpperCase().indexOf(filter) > -1) {
                            tr[i].style.display = "";
                        } else {
                            tr[i].style.display = "none";
                        }
                    }
                }
            }
        
        }

    }
    else if(!location.search.includes('&')){
        
        if (location.search.split('?')[1] == 'aipage=career'){
            document.getElementById("reset-search").style.display="inline-block"
            input = document.querySelectorAll("#search-me")[0]
            table = document.getElementsByClassName("career-home-career-table the-table-results")[0]
    
            filter = input.value.toUpperCase();
            tr = table.getElementsByTagName("tr");
            
            for (i = 1; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[1];
    
                if (td) {
                    txtValue = td.textContent || td.innerText;
    
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
    }
    else if(location.search.split('&')[0].split('?')[1] == 'aipage=career') {
        document.getElementById("reset-search").style.display="inline-block"
        input = document.querySelectorAll("#search-me")[0]
        table = document.getElementsByClassName("cp-role-table the-table-results")[0]

        filter = input.value.toUpperCase();
        tr = table.getElementsByTagName("tr");
        
        for (i = 1; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];

            if (td) {
                txtValue = td.textContent || td.innerText;

                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }


}

var resetTable = () => {
    document.querySelectorAll("#search-me")[1].value = "";
    searchTable();
    document.getElementById("reset-search").style.display="none"
}

