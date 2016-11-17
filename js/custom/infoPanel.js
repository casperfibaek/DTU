/*
 * This script takes an object and creates a bootstrap editable table
 * Author: NIRAS - Casper Fibæk
 */

 function eventJSON(geoJSON, style, highlight, editable){
   var layer = L.geoJSON(geoJSON, {"style": style})
     .on('click', function(e){

       var layer = this.getLayer(e.layer._leaflet_id);
       var feature = layer.feature;
       var latLng = e.latlng;
       map.panTo(latLng);

       L.popup({closeButton: false})
       .setLatLng(latLng)
       .setContent(infoPanel(feature.properties, editable))
       .openOn(map);

       if(editable === true){
         $('.table-remove').on('click', function(){
           $(this).parent().remove();
         });

         $('#addCollumn').on('click', function(){
           $(".table > tbody").append(addRow("unNames", "editMe", "string", "true", "true", false));

           $('.table-remove > i').on('click', function(){
             $(this).parent().parent().remove();
           });

           $(this).fadeTo(100, 0.5).fadeTo(150, 1.0);
         });

        if(layer.pm.enabled() === true){
          $("#editGeom").removeClass("disabled-edit").addClass("enabled-edit");
          $("#editGeom").first().text("Save edits");
        }

         $("#editGeom").click(function(e){
           if($(this).hasClass("disabled-edit")){
             layer.pm.enable(options);
             $(this).removeClass("disabled-edit").addClass("enabled-edit");
             $(this).first().text("Save edits");
             map.closePopup();
           } else {
             layer.pm.disable();
             $(this).removeClass("enabled-edit").addClass("disabled-edit");
             $(this).first().text("Edit Geometry");
           }
         });

         $("#deleteGeom").click(function(){
           map.removeLayer(layer);
           map.closePopup();
         });
       }
     })
     .on('mouseover', function(e){
       var feature = this.getLayer(e.layer._leaflet_id);
       feature.setStyle(highlight);
     })
     .on('mouseout', function(e){
       var feature = this.getLayer(e.layer._leaflet_id);
       feature.setStyle(style);
     });
    return layer;
 }

 function addRow(key, attribute, addClass, keyEdit, attrEdit, editable){
   var row;
   if(editable === true){
     row =
       "<tr class='table-row'>" +
         "<td class='rowName' contenteditable='" + keyEdit + "'>" + key + "</td>" +
         "<td contenteditable='" + attrEdit + "' " + "class='" + addClass + "'>" + attribute + "</td>" +
         "<td class='table-remove'>" +
           "<i class='fa fa-times' aria-hidden='true'></i>" +
         "</td>" +
       "</tr>";
   } else {
     row =
       "<tr class='table-row'>" +
         "<td class='rowName'>" + key + "</td>" +
         "<td class='" + addClass + "'>" + attribute + "</td>" +
       "</tr>";
   }

   return row;
 }

function infoPanel(obj, editable){
  var table;
  var keys;
  if(editable === true){
    table =
      "<div id='objTable' class='table-editable'>" +
        "<table class='table'>";

    keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {
        if(typeof(obj[keys[i]]) === "boolean" || obj[keys[i]] === "true" || obj[keys[i]] === "false"){
          table += addRow(keys[i], obj[keys[i]], "boolean", "false", "true");
        } else if(isNaN(obj[keys[i]]) !== "false"){
          table += addRow(keys[i], obj[keys[i]], "number", "false", "true");
        } else {
          table += addRow(keys[i], obj[keys[i]], "string", "false", "true");
        }
    }

    table +=
          "</table>" +
          "<div id='addCollumn' class='unselectable-text'><p>Add<i class='fa fa-plus table-add' aria-hidden='true'></i></p></div>" +
          "<div id='popup-button-wrap'>" +
            "<div id='editGeom' class='disabled-edit unselectable-text'><p>Edit<i class='fa fa-pencil table-edit' aria-hidden='true'></i></p></div>" +
            "<div id='deleteGeom' class='disabled-edit unselectable-text'><p>Delete<i class='fa fa-trash table-delete' aria-hidden='true'></i></p></div>" +
          "</div>" +
          "</div>";
  } else {
    table =
      "<div id='objTable' class='table-editable'>" +
        "<table class='table'>";

    keys = Object.keys(obj);

    for (var j = 0; j < keys.length; j++) {
        if(typeof(obj[keys[j]]) === "boolean" || obj[keys[j]] === "true" || obj[keys[j]] === "false"){
          table += addRow(keys[j], obj[keys[j]], "boolean");
        } else if(isNaN(obj[keys[j]]) !== "false"){
          table += addRow(keys[j], obj[keys[j]], "number");
        } else {
          table += addRow(keys[j], obj[keys[j]], "string");
        }
    }

    table += "</table></div>";
  }


  return table;
}
