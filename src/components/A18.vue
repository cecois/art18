<template>
  <div class="">
    <vue-headful :title="page.title" description="fxsxxxrrrre" />
    <vue-topprogress color="rgba(236, 88, 0, 1)" ref="topProgress"></vue-topprogress>
    <!--
      _   _    _    ____
    ) \_/ (  )_\  )  _)\
    |  _  | /( )\ | '__/
    )_( )_()_/ \_()_(

 -->
    <div id="map"></div nb="/#map">
    <!-- 
 ##   ##   ##  ##   ##
 ###  ##  #### ##   ##
 #### ## ##  ## ## ##
 ## #### ##  ## ## ##
 ##  ### ######  ###
 ##   ## ##  ##  ###
 ##   ## ##  ##   #
 -->
    <nav class="navbar mb-0 pb-0" role="navigation" aria-label="main navigation">
      <div class="navbar-brand pl-3">
        <img src="/static/art18-logo.svg" width="112" height="28">
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <a @click.prevent="modals.about=true">
              <IonHelp/>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <div id="map-gauges" class="columns is-multiline is-pulled-right mt-0 pt-3 pb-3 pl-4 pr-2">
      <div v-if="wards && page.schema && wards.features.length>0" id="map-classfx" :class="[page.splayed?'splayed':'','column is-12']">
        <h4 class="has-text-weight-bold is-size-4">%YES on 18</h4>
        <ion-icon name="bulb-outline" size="large"></ion-icon>
        <h6 class="is-size-6 pb-4 pl-2">
         classification: <span :class="page.schema=='jenks'?'has-text-weight-bold is-uppercase':''"><a @click.prevent="page.schema='jenks'" href="">jenks</a></span><sup><a target="_blank" href="http://wiki.gis.com/wiki/index.php/Jenks_Natural_Breaks_Classification'"><IonInfo /></a></sup> 
&nbsp;|&nbsp;
<span :class="page.schema=='quantile'?'has-text-weight-bold is-uppercase':''"><a @click.prevent="page.schema='quantile'" href="">quantile</a></span><sup><a target="_blank" href="http://wiki.gis.com/wiki/index.php/Quantile"><IonInfo /></a></sup>
</h6>
        <div class="pl-3 is-size-7">
          <p class="mb-1" v-for="swatch in scales[page.schema]">
            <!-- { "upper": 50, "lower": 14, "range": "14 - 50", "color": "#f1f2ebff" } -->
            {{swatch.range}} <span :style="`border:1px solid white;background-color:${swatch.color}`" class="map-gauge-legend-swatch is-pulled-right"></span>
          </p>
          <!-- http://wiki.gis.com/wiki/index.php/Jenks_Natural_Breaks_Classification -->
          <!-- http://wiki.gis.com/wiki/index.php/Quantile -->
        </div>
      </div>
      <!-- if.wards -->
      <div class="column is-12" v-if="actives.precinct && actives.precinct!=='$'">
        <div class="is-pulled-right is-size-5">
          <!-- <a @click.prevent="actives.precinct=null" href=""> -->
          <a @click.prevent="$_.each(grpwards.getLayers(),l=>{l.closePopup()})" href="">
            <IonClose />
          </a>
        </div>
        <!-- { "WP_NAME": "Brookline Town Precinct 1", "WARD": null, "PRECINCT": "1", "DISTRICT": "1", "POP_2010": 3600, "TOWN": "BROOKLINE", "TOWN_ID": 46, "AREA_SQMI": 0.283, "AREA_ACRES": 180.9, "YEAR": 2012, "SHAPE_AREA": 732069.73652000003, "SHAPE_LEN": 3709.5160078, "art18_ttlno": 0, "art18_ttlyes": 15, "art18_pctyestxt": "100%", "art18_pctyes": 100 }, -->
        <div class="has-text-weight-bold is-size-5 mb-3 mt-3">{{actives.precinct.WP_NAME}}:</div>
        <div class="is-size-6 has-text-grey">% yes: <span class="has-text-black">{{actives.precinct.art18_pctyes}}</span></div>
        <div class="is-size-6 has-text-grey">total yes: <span class="has-text-black">{{actives.precinct.art18_ttlyes}}</span></div>
        <div class="is-size-6 has-text-grey">total no: <span class="has-text-black">{{actives.precinct.art18_ttlno}}</span></div>
        <div class="is-size-6 has-text-grey">population 2010 (census): <span class="has-text-black">{{actives.precinct.POP_2010}}</span></div>
        <div class="is-size-6 has-text-grey">population per mi<sup>2</sup>: <span class="has-text-black">{{(actives.precinct.POP_2010/actives.precinct.AREA_SQMI).toFixed(1)}}</span></div>
      </div>
      <!-- if.actives.precinct -->
    </div>
    <!-- 
          _            _
        ,'_)          ( )
        | |  ___  ___ | |  ___  __
        ( _)( o )( o )( _)( o_)( _)
        /_\  \_/  \_/ /_\  \(  /_\
 -->
    <footer class="footer pt-1 pb-1 has-text-centered">
      <div id="ebl-layers" class="level is-mobile pl-2 pr-2 is-family-monospace">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <a @click.prevent="modals.konsole=!modals.konsole">
              <IonRadio />
            </a>
          </div>
        </div>
        <div class="level-right pb-2">
          <figure :data-tooltip="bm.name" v-for="bm in $CONFIG.basemaps" class="image is-24x24 mr-2 has-tooltip-arrow">
            <img @click="actives.basemap=bm.handle" :class="['bt_baseMap','is-rounded',bm.handle==actives.basemap? 'active': '']" :src="bm.thmb">
          </figure>
        </div>
      </div>
    </footer>
    <!-- 
                              dP          dP
                              88          88
    88d8b.d8b. .d8888b. .d888b88 .d8888b. 88 .d8888b.
    88'`88'`88 88'  `88 88'  `88 88'  `88 88 Y8ooooo.
    88  88  88 88.  .88 88.  .88 88.  .88 88       88
    dP  dP  dP `88888P' `88888P8 `88888P8 dP `88888P'
 -->
    <div id="modal-konsole" :class="['modal',modals.konsole?'is-active':'']">
      <div class="modal-background"></div>
      <div class="modal-content is-size-7 has-text-grey-lighter is-family-monospace">
        <p v-for="msg in konsole">{{msg.msg}}</p>
      </div>
      <button @click="modals.konsole=false" class="modal-close is-large" aria-label="close"></button>
    </div>
    <!-- modal-konsole -->
    <div id="modal-about" :class="['modal',modals.about?'is-active':'']">
      <div class="modal-background"></div>
      <div class="modal-content is-size-7 has-text-grey-lighter is-family-monospace">
        <p class="pb-3">This is a Q&D (quick-and-dirty) web app that visualizes* the results of a 2021.May.25 vote on Article 18 that sought to <a href="https://www.brooklinema.gov/DocumentCenter/View/23725/2021-Annual-Town-Meeting-Article-Explanations">expand Lawrence Local Historical District</a> (see Article 18 starting p.17). The data are preliminary and were <a href="https://www.facebook.com/groups/562671360550595/permalink/1941577835993267/#">provided on FaceBook</a> — read: unofficially — by Mike Toffel.</p>
        <p class="pt-3">
          This is in no way an official or officially-endorsed project (by either Town of Brookline or Mr. Toffel, for that matter); rather a response to Toffel's expressed hope on FB for "a mapmaker to plot the 'percent yes' data here, as there's fascinating disparities across precinct contingencies of TMMs."
        </p>
        <p class="mt-6">* excludes abstain votes</p>
      </div>
      <button @click="modals.about=false" class="modal-close is-large" aria-label="close"></button>
    </div>
    <!-- modal-about -->
  </div nb="root">
</template>

<script>
// ions 
import IonInfo from 'vue-ionicons/dist/ios-information-circle-outline.vue'
import IonRadio from 'vue-ionicons/dist/ios-radio.vue'
import IonClose from 'vue-ionicons/dist/ios-close-circle-outline.vue'
import IonHelp from 'vue-ionicons/dist/ios-help-circle-outline.vue'

export default {
  name: "art18bma21",
  components: { IonInfo, IonRadio, IonClose, IonHelp },
  created: function() {

    this.wards = this.$WARDS;

    // here we do some intercepting of our colloquial router null, the '$'
    this.actives = {
      basemap: (!this.$route.params.basemap || this.$route.params.basemap == '$') ? 'carto_darkmatter' : this.$route.params.basemap,
      precinct: (!this.$route.params.precinct || this.$route.params.precinct == '$') ? '$' : this.$_.find(this.wards.features, wardFeature => {
        return wardFeature.properties.PRECINCT == this.$route.params.precinct
      }).properties,
      bboxstring: (!this.$route.params.bbox || this.$route.params.bbox == '$') ? null : this.$route.params.bbox
    }

    // "/:schema?/:basemap?/:splayed?/:bbox?",
    this.page.schema = (!this.$route.params.schema || this.$route.params.schema == '$') ? 'jenks' : this.$route.params.schema
    this.page.splayed = (!this.$route.params.splayed || this.$route.params.splayed == '$') ? 'false' : this.$route.params.splayed

  },
  mounted: function() {
    this.loadings.app = true;

    this.konsole = [{ msg: `${new Date()} - mounted`, klass: 'is-info', timeout: 20, timeout: 20 }]

    // init a leaflet map ob
    this.MAP = new L.Map("map", {
        editable: true,
        zoomControl: false,
        center: [42.32726811151676, -71.12093925476076],
        zoom: 13,
        attributionControl: false
      })
      .on('moveend', e => {
        this.actives.bboxstring = this.MAP.getBounds().toBBoxString()
      })

    if (this.actives.bboxstring) {

      this.konsole.push({ msg: 'incoming bbox has been set in created hook, settinig view...', klass: 'is-info', timeout: 20, timeout: 20 })
      let bba = this.actives.bboxstring.split(',')

      let bb = {
        west: bba[0],
        south: bba[1],
        east: bba[2],
        north: bba[3]
      }
      this.MAP.fitBounds([
        [bb.south, bb.west],
        [bb.north, bb.east]
      ])
    }

    let p = 408;

    this.MAP.createPane('pnBasemaps')
      .style.zIndex = (p - 1);
    this.MAP.createPane('pnWards')
      .style.zIndex = (p + 1);


    /*
      ___  ____   __    __  ____  ____
     / __)(  _ \ /  \  /  \(  _ \/ ___)
    ( (_ \ )   /(  O )(  O )) __/\___ \
     \___/(__\_) \__/  \__/(__)  (____/
     
     groops */

    if (!this.grpbasemaps) {
      this.grpbasemaps = new L.featureGroup({ pane: 'pnBasemaps' }).addTo(this.MAP)
    }

    if (!this.grpwards) {
      this.grpwards = new L.featureGroup({ pane: 'pnWards' })
        .on("layeradd", l => {
          console.log("l in layeradd cb", l);
        })
        .addTo(this.MAP)

      this.layers.push({ handle: 'grpwards', on: false, abbrev: "hstb", klass: 'icon-noun_buffer' })
    }

    document.addEventListener("keydown", (e) => {

      if (e.key.toLowerCase() == 'escape') {

        this.$_.each(this.$_.allKeys(this.modals), mok => {
          this.modals[mok] = false;
        })

      }
    })

    // $.getJSON('static/WARDSPRECINCTS.geojson', G => {
    //   this.wards = G;
    // });

    this.loadings.app = false;


    window.V = this;
    console.log(window.V);

  },
  data() {
    return {
      MAP: null,
      wardaliases: [],
      wards: null,
      actives: {
        basemap: null,
        bboxstring: null,
        precinct: null
      },
      layers: [],
      konsole: [],
      page: { title: "art18 - Brookliine, MA 2021", splayed: false, schema: null },
      modals: { credits: false, konsole: false, about: false },
      loadings: { app: false },
      console: { state: null, msgs: [] },
      credits: [
        "radio icon: ionicons"
      ],
      // https://coolors.co/f1f2eb-d8dad3-a4c2a5-566246-4a4a48
      scales: {
        "quantile": [
          { "upper": 50, "lower": 14, "range": "14.* - 50", "color": "#f1f2ebff" }, { "upper": 71, "lower": 50, "range": "50.* - 71", "color": "#d8dad3ff" }, { "upper": 79, "lower": 71, "range": "71.* - 79", "color": "#a4c2a5ff" }, { "upper": 83, "lower": 79, "range": "79.* - 83", "color": "#566246ff" }, { "upper": 100, "lower": 83, "range": "83.* - 100", "color": "#4a4a48ff" }
        ],
        "jenks": [{ "upper": 14, "lower": 14, "range": "14", "color": "#f1f2ebff" }, { "upper": 36, "lower": 14, "range": "14.* - 36", "color": "#d8dad3ff" }, { "upper": 64, "lower": 36, "range": "36.* - 64", "color": "#a4c2a5ff" }, { "upper": 86, "lower": 64, "range": "64.* - 86", "color": "#566246ff" }, { "upper": 100, "lower": 86, "range": "86.* - 100", "color": "#4a4a48ff" }]
      }
    };
  },
  methods: {
    _STILE: function(schema, value, active) {


      if (active) {
        return { weight: 2, opacity: 1, color: `rgb(45,221,99)`, fill: true, fillOpacity: .95, fillColor: 'rgb(45,221,99)' }
      } else {

        switch (schema) {
          case 'quantile':

            return {
              weight: 1,
              opacity: .7,
              color: "#000",
              fillColor: this.$_.find(this.scales.quantile, scaleEntry => {
                return value >= scaleEntry.lower && value <= scaleEntry.upper
              }).color,
              fill: true,
              fillOpacity: .9
            }
            break;

          case 'jenks':
            return {
              weight: 1,
              opacity: .7,
              color: "#000",
              fillColor: this.$_.find(this.scales.jenks, scaleEntry => {
                return value >= scaleEntry.lower && value <= scaleEntry.upper
              }).color,
              fill: true,
              fillOpacity: .9
            }
            break;
          default:
            return { weight: 5, opacity: .7, color: `rgba(234, 221, 141, 1)`, fill: true, fillOpacity: .6 }
            // return { color: `rgba(${Math.floor((Math.random() * 254) + 1)},${Math.floor((Math.random() * 254) + 1)},${Math.floor((Math.random() * 254) + 1)},${Math.random()})`, fillColor: `rgba(${Math.floor((Math.random() * 254) + 1)},${Math.floor((Math.random() * 254) + 1)},${Math.floor((Math.random() * 254) + 1)},${Math.random()})`, fill: true, fillOpacity: Math.random() }
            break;
        }

      } //!active

    },
    _MANAGEPRECINCTS: function(upordown) {

      this.konsole.push({ msg: upordown == 'up' ? `${new Date()} - activating precinct ${this.actives.precinct.PRECINCT}` : `${new Date()} - deactivating precinct`, klass: 'is-info', timeout: 20, timeout: 20 })

      this.grpwards.getLayers().length > 0 && this.$_.each(this.$_.first(this.grpwards.getLayers()).getLayers(), wl => {
        (this.actives.precinct && wl.feature.properties.PRECINCT == this.actives.precinct.PRECINCT) ? wl.setStyle(this._STILE(this.page.schema, wl.feature.properties.art18_pctyes, true)): wl.setStyle(this._STILE(this.page.schema, wl.feature.properties.art18_pctyes))
      })



    },
    _MAPPRECINCTS: function(F) {

        if (this.wards) {
          this.konsole.push({ msg: `${new Date()} - mapping ${this.wards.features.length} precincts`, klass: 'is-info', timeout: 20, timeout: 20 })

          this.grpwards.clearLayers();

          L.geoJSON(this.wards, {
              style: (feature) => {
                return this._STILE(this.page.schema, feature.properties.art18_pctyes)
              }
            })
            .on("click", e => {
              // this.actives.feature=
              // this.actives.precinct = e.layer.feature.properties.PRECINCT
              this.actives.precinct = e.layer.feature.properties
                // feature to light up is at e.layer.feature but we'll have a watcher deal with that
            })
            .bindPopup(layer => {
              return `<h4 class="is-size-4">PRECINCT ${layer.feature.properties.PRECINCT}</h4>
            <div class="is-size-6">${layer.feature.properties.art18_ttlyes} <span class="has-text-grey">(${layer.feature.properties.art18_pctyestxt})</span></div>
            `;
            })
            .on('popupclose', e => { this.actives.precinct = null })
            .addTo(this.grpwards);

          this.grpwards.bringToFront();
          this.actives.precinct && this._MANAGEPRECINCTS();
        } //if.wards

      } //mapprecincts
      ,
    _SETROUTE: function() {
        let P = {
          schema: this.page.schema ? this.page.schema : '$',
          splayed: this.page.splayed ? this.page.splayed : '$',
          basemap: this.actives.basemap ? this.actives.basemap : '$',
          bbox: this.actives.bboxstring ? this.actives.bboxstring : '$',
          precinct: this.actives.precinct ? this.actives.precinct.PRECINCT : '$'
        }
        this.$router.push({
          params: P
        }); //rejplace
      } //setRoute

  } //methods
  ,
  watch: {
    "actives.precinct": {
      deep: true,
      handler: function(vnew, vold) {
          this._MANAGEPRECINCTS(vnew ? 'up' : 'down');
          this._SETROUTE();
        } //handler
    } //loadings
    ,
    "page.schema": {
      handler: function(vnew, vold) {
          this._MAPPRECINCTS();
          this._SETROUTE();
        } //handler
    } //loadings
    ,
    wards: {
      handler: function(vnew, vold) {
          this._MAPPRECINCTS();
        } //handler
    } //loadings
    ,
    "loadings": {
      deep: true,
      handler: function(vnew, vold) {
          this.$_.contains(this.$_.values(this.loadings), true) ? this.$refs.topProgress.start() : this.$refs.topProgress.done()
        } //handler
    } //loadings
    ,
    "actives.basemap": {
      handler: function(vnew, vold) {

          console.log(`in actives.basemap watcher vnew is ${vnew} and config is ${this.$CONFIG}`)

          let buri = this.$_.findWhere(this.$CONFIG.basemaps, { handle: this.actives.basemap }).urii
          if (buri) {
            this.grpbasemaps.clearLayers()
            this.grpbasemaps.addLayer(new L.TileLayer(buri));
          }

          this._SETROUTE()

        } //handler
    } //actives.basemap
    ,
    "actives.bboxstring": {
      handler: function(vnew, vold) {

          this._SETROUTE()

        } //handler
    } //actives.bbox
  } //watch
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss">
</style>
