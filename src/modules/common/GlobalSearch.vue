<template>
  <form
    :action="'https://www.teachstarter.com/search/?query=' + query"
    method="get"
    class="search-container hidden-small"
    target="_blank"
    v-shortkey="['esc']"
    @shortkey="closeAutocomplete"
  >
    <label for="query" hidden>Search</label>
    <input
      id="query"
      name="query"
      ref="item0"
      type="search"
      placeholder="Search resources..."
      autocomplete="off"
      v-model="query"
      @input="onSearchInput"
      @focus="active = true"
    />
    <button role="submit" class="main-nav-search-button" aria-label="Search" tabindex="-1">
      <svg height="16" width="16" role="img" viewBox="0 0 24 24">
        <title>Search</title>
        <path
          fill="currentColor"
          fill-rule="nonzero"
          d="M23.809 21.646l-6.205-6.205a9.68 9.68 0 001.857-5.711C19.461 4.365 15.096 0 9.73 0 4.365 0 0 4.365 0 9.73c0 5.366 4.365 9.73 9.73 9.73a9.678 9.678 0 005.487-1.698L21.455 24l2.354-2.354zM2.854 9.73a6.885 6.885 0 016.877-6.877 6.885 6.885 0 016.877 6.877 6.885 6.885 0 01-6.877 6.877A6.884 6.884 0 012.854 9.73z"
        />
      </svg>
    </button>
    <div :class="{ autocomplete: true, hidden: !active }">
      <a
        :href="'https://www.teachstarter.com/search/?query=' + query"
        id="autocomplete-query"
        title="Search site"
        ref="item1"
      >
        Search for <mark>{{ query || 'everything' }}</mark> in all resources
      </a>

      <template v-if="query.length > 2">
        <template v-if="resultsLoading">
          <div class="skeleton">
            <span></span>
            <span></span>
          </div>
          <div class="skeleton">
            <span></span>
            <span></span>
          </div>
        </template>

        <ul v-else class="no-list">
          <li v-for="result in results" :key="result.id" ref="results">
            <a
              v-if="result.taxonomyTitle"
              :href="'https://www.teachstarter.com/' + result.url"
              title="View this topic"
              target="_blank"
            >
              <svg height="16" width="16" role="img" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fill-rule="nonzero"
                  d="M8 7.125v-1.5c0-.206.169-.375.375-.375h9.75c.206 0 .375.169.375.375v1.5a.376.376 0 01-.375.375h-9.75A.376.376 0 018 7.125zm.375 4.125h9.75a.376.376 0 00.375-.375v-1.5A.376.376 0 0018.125 9h-9.75A.376.376 0 008 9.375v1.5c0 .206.169.375.375.375zm14.02 7.486c-.197.61-.197 2.419 0 3.028A.75.75 0 0123 22.5v.75c0 .413-.337.75-.75.75H5.75A3.749 3.749 0 012 20.25V3.75A3.749 3.749 0 015.75 0h16.5c.413 0 .75.338.75.75V18a.75.75 0 01-.605.736zm-1.926.014H5.75c-.825 0-1.5.675-1.5 1.5 0 .83.67 1.5 1.5 1.5h14.719c-.127-.81-.127-2.19 0-3zm.281-16.5h-15c-.83 0-1.5.67-1.5 1.5v13.064a3.72 3.72 0 011.5-.314h15V2.25z"
                />
              </svg>
              <strong v-html="highlight(result.name)"></strong> {{ result.taxonomyTitle }}
              <span class="label">{{ result.postsCount }}</span></a
            >
            <a
              v-else
              :href="'https://www.teachstarter.com' + result.url"
              title="View this resource"
              target="_blank"
            >
              <figure>
                <img :src="'https://www.teachstarter.com' + result.image" />
              </figure>
              <span
                ><div :class="'text-' + result.postType">{{ result.postTypeTitle }}</div>
                <strong v-html="highlight(result.title)"></strong
              ></span>
            </a>
          </li>
        </ul>
      </template>
    </div>
  </form>
</template>

<script>
/* Global Search - search resources from Algolia via our API
 *
 * @parent: /common/MainHeader.vue
 * @requests: /v1/search/resource, /v1/search/topic
 * @events:
 * @props:
 * @components:
 * @methods: highlight, search, toggleAutocomplete, unfocus
 */

import API from '@/router/api';
import axios from 'axios';
import debounce from '@/shared/utils/debounce';

export default {
  name: 'GlobalSearch',
  data() {
    return {
      active: false,
      query: '',
      limit: 3,
      results: [],
      resultsLoading: true,
      selectedItem: 0,
    };
  },
  mounted() {
    window.addEventListener('click', this.close);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.close);
  },
  methods: {
    close(e) {
      // close autocomplete when clicked outside
      if (this.$el.children[0] !== e.target && e.target.id != 'query') {
        this.active = false;
      }
    },
    highlight(str) {
      // Yellow highlight the matching part of the code code
      return str.replace(new RegExp(this.query, 'gi'), match => '<mark>' + match + '</mark>');
    },
    onSearchInput: debounce(function() {
      // Start searching after 2 characters
      if (this.results == null && this.query.length < 3) return;

      // Trigger 2 search queries every 0.3 sec
      this.search(this.query, 'topic');
      //this.search(this.query, 'resource');
    }, 300),
    search(query, type) {
      this.resultsLoading = true;

      // Query Algolia via our API
      return axios
        .get(API.search + type, {
          params: {
            query: query,
            perPage: this.limit,
            full: 0, // Return direct results from Algolia
          },
        })
        .then(response => {
          const { data: { list = [] } = {} } = response;
          this.resultsLoading = false;

          // BE CAREFUL! Don't loop recursively
          if (type == 'topic') {
            this.results = list;
            this.search(query, 'resource');
          } else {
            this.results = this.results.concat(list);
          }
        })
        .catch(error => {
          // eslint-disable-next-line
          console.log(error);
        });
    },
    closeAutocomplete() {
      this.query = '';
      this.active = false;
      document.activeElement.blur();
    },
    navigateItems() {
      event.preventDefault();

      if (event.keyCode !== 38 && event.keyCode !== 40) return;

      let item = null;

      if (event.keyCode == 38 && this.selectedItem > -1) {
        this.selectedItem--;
      } else if (event.keyCode == 40 && this.selectedItem < 7) {
        this.selectedItem++;
      } else {
        this.selectedItem = 0;
      }

      if (this.selectedItem < 2) {
        item = this.$refs['item' + this.selectedItem];
      } else if (this.selectedItem < this.results.length + 2) {
        item = this.$refs.results[this.selectedItem - 2].children[0];
      }

      if (item) {
        item.focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/components/_search.scss';
</style>
