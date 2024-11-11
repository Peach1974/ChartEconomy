$(document).ready(function() {
    // Toggle multiselect options
    $('.multiselect').on('click', '.multiselect-selected', function() {
      $(this).siblings('.multiselect-options').toggle();
    });

    // Close multiselect when clicking outside
    $(document).on('click', function(event) {
      if (!$(event.target).closest('.multiselect').length) {
        $('.multiselect-options').hide();
      }
    });

    // Handle checkbox selection in multiselect
    $('.multiselect-options input[type="checkbox"]').on('change', function() {
      var selected = [];
      $(this).closest('.multiselect-options').find('input[type="checkbox"]:checked').each(function() {
        selected.push($(this).parent().text().trim());
      });
      var selectedText = selected.length > 0 ? selected.join(', ') : 'Select Country/Region';
      $(this).closest('.multiselect').find('.multiselect-selected').text(selectedText);
    });

    // Select All Categories checkbox
    $('input[name="category"][value="all"]').on('change', function() {
      if ($(this).prop('checked')) {
        $('input[name="category"][value!="all"]').prop('checked', true);
        $('#industryFilters').show();
      } else {
        $('input[name="category"][value!="all"]').prop('checked', false);
        $('#industryFilters').hide();
      }
    });

    // Events checkbox
    $('input[name="category"][value="events"]').on('change', function() {
      $('#industryFilters').toggle(this.checked);
    });

    // Grouping selection
    $('#groupingSelect').on('change', function() {
      var selectedGrouping = $(this).val();
      var selectedCountries = [];

      if (selectedGrouping === 'g20') {
        selectedCountries = ['USA', 'Canada', 'UK']; // Add more G20 countries here
      }

      $('.multiselect-options input[type="checkbox"]').each(function() {
        var country = $(this).val();
        $(this).prop('checked', selectedCountries.includes(country));
      });
      $('.multiselect-options input[type="checkbox"]').trigger('change');
    });

    // Event handler for filter tabs
    $('.filter-tab').on('click', function() {
      $('.filter-tab').removeClass('active');
      $(this).addClass('active');

      var filterValue = $(this).data('filter');
      var fromDate, toDate;

      if (filterValue === 'day') {
        fromDate = new Date(); // Today's date
        toDate = new Date(); // Today's date
      } else if (filterValue === 'week') {
        fromDate = new Date();
        toDate = new Date();
        toDate.setDate(toDate.getDate() + 7); // Add 7 days to the current date
      } else if (filterValue === 'month') {
        fromDate = new Date();
        toDate = new Date();
        toDate.setMonth(toDate.getMonth() + 1); // Add 1 month to the current date
      }

      // Update the datepicker values
      $("#datepicker-from").datepicker("setDate", fromDate);
      $("#datepicker-to").datepicker("setDate", toDate);
    });

    // Initialize Datepicker
    $("#datepicker-from").datepicker({
      dateFormat: "dd-mm-yy",
      changeMonth: true,
      changeYear: true
    });

    $("#datepicker-to").datepicker({
      dateFormat: "dd-mm-yy",
      changeMonth: true,
      changeYear: true
    });

    // Search and filter table
    $('#searchBox').on('input', function() {
      var searchText = $(this).val().toLowerCase();
      $('#dataTable tbody tr').each(function() {
        var rowData = $(this).find('td');
        var showRow = false;
        rowData.each(function() {
          var cellData = $(this).text().toLowerCase();
          if (cellData.includes(searchText)) {
            showRow = true;
            return false; // Break the loop if match found
          }
        });
        $(this).toggle(showRow);
      });
    });

    // Set 'Day' as the default selected filter tab
    $('.filter-tab[data-filter="day"]').addClass('active');
  });