			</div>
		</div>
	</div>
</div>
<!-- Default bootstrap modal example -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Mbooth json file</h4>
      </div>
      <pre class="modal-body">
        ...
      </pre>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
<script>
d_shopunity.init({ 
	'purchase_url': '<?php echo $purchase_url; ?>'
});
</script>
<?php echo $footer; ?>